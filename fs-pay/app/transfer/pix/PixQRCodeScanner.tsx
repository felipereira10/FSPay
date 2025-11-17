import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { api } from '../../../services/api'; 
import { AxiosError } from 'axios';

const PixQRCodeScanner = () => {
  const [code, setCode] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  // Previne que o scanner chame a API múltiplas vezes rapidamente.
  const [isProcessing, setIsProcessing] = useState(false); 

  useEffect(() => {

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = async (scannedCode?: string) => {
    if (isProcessing) return;

    const qrCode = scannedCode || code;
    
    if (!qrCode) {
      return Alert.alert('Erro', 'Informe ou escaneie um código QR');
    }

    setIsProcessing(true);

    try {
      const response = await api.post('/pix/read-qrcode', { code: qrCode });
      
      Alert.alert('QR Code lido com sucesso!', response.data.message);
      setCode('');

    } catch (err: unknown) {
      const error = err as AxiosError<any>;
      
      Alert.alert(
        'Erro ao ler QR Code', 
        error.response?.data?.detail || error.message || 'Erro desconhecido'
      );
    } finally {
      setIsProcessing(false);
      setScanning(false); 
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Solicitando permissão para a câmera...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>Sem acesso à câmera. Verifique as configurações do aplicativo.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!scanning ? (
        // === Tela de Entrada Manual ===
        <>
          <Text style={styles.label}>Código do QR Code:</Text>
          <TextInput
            placeholder="Cole o código aqui"
            placeholderTextColor="#888"
            style={styles.input}
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => handleScan()}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processando...' : 'Ler Código Manual'}
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Button 
              title="Usar Câmera para QR" 
              onPress={() => setScanning(true)} 
              color="#00ced1"
            />
          </View>
        </>
      ) : (
        // === Tela do Scanner (Câmera) ===
        <View style={StyleSheet.absoluteFillObject}>
          <BarCodeScanner
            onBarCodeScanned={isProcessing ? undefined : ({ data }) => handleScan(data)}
            style={StyleSheet.absoluteFillObject}
          />

          {/* NOVO: Guia visual para o usuário */}
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>Posicione o código QR do Pix na área.</Text>
            <View style={styles.scannerGuide} />
          </View>
          
          {/* Botão Cancelar */}
          <View style={styles.cancelButtonContainer}>
            <Button title="Cancelar" onPress={() => setScanning(false)} color="#FFF" />
          </View>
        </View>
      )}
    </View>
  );
};

export default PixQRCodeScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#118096',
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#00ced1',
    padding: 14,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 5,
  },
  scannerGuide: {
    width: 280,
    height: 280,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
  },
  cancelButtonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  }
});