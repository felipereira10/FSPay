import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { api } from '../../../services/api';

const PixQRCodeScanner = () => {
  const [code, setCode] = useState('');
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleScan = async (scannedCode?: string) => {
    const qrCode = scannedCode || code;
    if (!qrCode) return Alert.alert('Erro', 'Informe ou escaneie um código QR');

    try {
      const response = await api.post('/pix/read-qrcode', { code: qrCode });
      Alert.alert('QR Code lido com sucesso!', response.data.message);
      setCode('');
      setScanning(false);
    } catch (err: unknown) {
      const error = err as any;
      Alert.alert('Erro ao ler QR Code', error.response?.data?.detail || 'Erro desconhecido');
    }
  };

  if (hasPermission === null) return <Text>Solicitando permissão para a câmera...</Text>;
  if (hasPermission === false) return <Text>Sem acesso à câmera</Text>;

  return (
    <View style={styles.container}>
      {!scanning ? (
        <>
          <Text style={styles.label}>Código do QR Code:</Text>
          <TextInput
            placeholder="Cole o código aqui"
            style={styles.input}
            value={code}
            onChangeText={setCode}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleScan()}>
            <Text style={styles.buttonText}>Ler Código Manual</Text>
          </TouchableOpacity>

          <Button title="Usar Câmera para QR" onPress={() => setScanning(true)} />
        </>
      ) : (
        <>
          <BarCodeScanner
            onBarCodeScanned={({ data }) => handleScan(data)}
            style={StyleSheet.absoluteFillObject}
          />
          <Button title="Cancelar" onPress={() => setScanning(false)} />
        </>
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
});