import React from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../store/authSlice';

export function ProfileScreen() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text>Nom: {user.first_name} {user.last_name}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Équipe: {user.team_id}</Text>
      {/* Formulaire de modification */}
    </View>
  );
} 