import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button
} from 'react-native';

import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';
import Grafico from './components/Grafico';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [ordenacao, setOrdenacao] = useState('recentes'); // valor inicial
  const [registroEmEdicao, setRegistroEmEdicao] = useState(null);

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const handleSave = (horasTrabalho, horasTreino, horasDescanso) => {
  if (trabalhoNum < 0 || treinoNum < 0 || descansoNum < 0) {
  return Alert.alert("Erro de Validação", "Nenhum valor pode ser negativo. Por favor, corrija.");
    }
    const trabalhoNum = parseFloat(String(horasTrabalho).replace(',', '.'));
    const treinoNum = parseFloat(String(horasTreino).replace(',', '.'));
    const descansoNum = parseFloat(String(horasDescanso).replace(',', '.'));

    if (editingId) {
      const registrosAtualizados = registros.map(reg =>
        reg.id === editingId ? { ...reg, trabalho: trabalhoNum, treino: treinoNum, descanso: descansoNum } : reg
      );
      setRegistros(registrosAtualizados);
    } else {
      const novoRegistro = { id: new Date().getTime(), data: new Date().toLocaleDateString('pt-BR'), trabalho: trabalhoNum, treino: treinoNum, descanso: descansoNum};

      setRegistros([...registros, novoRegistro]);
      Alert.alert('Sucesso!', 'Seu registro foi salvo!');
    }
    setEditingId(null);
  };



  const handleDelete = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
    Alert.alert('Sucesso!', 'O registro foi deletado.');
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const exportarDados = async () => {
      const fileUri = Database.fileUri; // Usando a variável exportada se disponível, senão recriar
      if (Platform.OS === 'web') {
          const jsonString = JSON.stringify(registros, null, 2);
          if (registros.length === 0) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'dados.json'; a.click();
          URL.revokeObjectURL(url);
      } else {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          if (!(await Sharing.isAvailableAsync())) { return Alert.alert("Erro", "Compartilhamento não disponível."); }
          await Sharing.shareAsync(fileUri);
      }
  };

  if (carregando) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#3498db" /></View>;
  }

  let registrosExibidos = [...registros]; // Sempre trabalhe com uma cópia! 

if (ordenacao === 'maior_treino') {
  // O método .sort() modifica o array, por isso a cópia é importante. 
  // ⚡️ Substitua 'agua' pelo nome do seu campo. 
  registrosExibidos.sort((a, b) => b.treino - a.treino);
} else {
  // Ordenação padrão por 'recentes' (ID maior primeiro)
  registrosExibidos.sort((a, b) => b.id - a.id);
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Meu Dia em Números</Text>
        <Grafico registros={registrosExibidos}Gráficos/>
        <Text style={styles.subtituloApp}>App Componentizado</Text>

        <Formulario 
          onSave={handleSave} 
          onCancel={handleCancel}
          registroEmEdicao={registros.find(r => r.id === editingId) || null}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10 }}>
  <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} />
  {/* ⚡️ Substitua 'agua' pelo nome de um dos seus campos! */}
  <Button title="Maior Valor (treino)" onPress={() => setOrdenacao('maior_treino')} />
</View>

        <ListaRegistros 
          registros={registrosExibidos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <View style={styles.card}>
            <Text style={styles.subtitulo}>Exportar "Banco de Dados"</Text>
            <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
                <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#050505' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#ffffff' },
  subtituloApp: { textAlign: 'center', fontSize: 16, color: '#555', marginTop: -20, marginBottom: 20, fontStyle: 'italic' },
  card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#050505' },
  botaoExportar: { backgroundColor: '#050505', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});