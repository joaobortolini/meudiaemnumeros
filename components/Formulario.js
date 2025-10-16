import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [horasTrabalho, setHorasTrabalho] = useState('');
  const [horasTreino, setHorasTreino] = useState('');
  const [horasDescanso, setHorasDescanso] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setHorasTrabalho(String(registroEmEdicao.trabalho));
      setHorasTreino(String(registroEmEdicao.treino));
      setHorasDescanso(String(registroEmEdicao.descanso));
    } else {
      setHorasTrabalho('');
      setHorasTreino('');
      setHorasDescanso('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(horasTrabalho, horasTreino, horasDescanso);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>
      <TextInput style={styles.input} placeholder="Horas de trabalho" keyboardType="numeric" value={horasTrabalho} onChangeText={setHorasTrabalho} />
      <TextInput style={styles.input} placeholder="Horas de treino" keyboardType="numeric" value={horasTreino} onChangeText={setHorasTreino} />
      <TextInput style={styles.input} placeholder="Horas de descanso" keyboardType="numeric" value={horasDescanso} onChangeText={setHorasDescanso} />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor: 'white', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
    subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#050505' },
    input: { borderWidth: 1, borderColor: '#cccccc', borderRadius: 5, padding: 12, fontSize: 16, marginBottom: 10 },
    botao: { backgroundColor: '#050505', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    botaoTexto: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    botaoCancelar: { backgroundColor: '#7f8c8d', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});