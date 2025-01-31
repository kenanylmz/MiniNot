import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/colors';
import CustomAlert from './CustomAlert';
import {useCustomAlert} from '../hooks/useCustomAlert';

const {width} = Dimensions.get('window');
const cardWidth = (width - 80) / 2;

const NoteCard = ({
  note,
  onPress,
  onDelete,
  onEdit,
  onLongPress,
  isSelected,
}) => {
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();
  const scaleValue = new Animated.Value(1);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress(note));
  };

  const handleDelete = () => {
    showAlert({
      title: 'Not Silme',
      message: 'Bu notu silmek istediğinizden emin misiniz?',
      type: 'warning',
      buttons: [
        {
          text: 'İptal',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDelete(note.id),
        },
      ],
    });
  };

  return (
    <>
      <Animated.View
        style={[
          styles.container,
          {backgroundColor: note.color || COLORS.noteColors[0]},
          {transform: [{scale: scaleValue}]},
          isSelected && styles.selectedNote,
        ]}>
        <View style={styles.pinContainer}>
          <View style={styles.pinHead} />
          <View style={styles.pinNeedle} />
        </View>

        <TouchableOpacity
          style={styles.contentContainer}
          onPress={handlePress}
          onLongPress={() => onLongPress(note)}
          delayLongPress={1000}>
          <Text style={styles.title} numberOfLines={2}>
            {note.title}
          </Text>
          <Text style={styles.content} numberOfLines={3}>
            {note.content}
          </Text>
          <Text style={styles.date}>
            {new Date(note.createdAt).toLocaleDateString('tr-TR')}
          </Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Icon name="pencil" size={20} color={COLORS.text.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Icon name="delete" size={20} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </Animated.View>
      <CustomAlert {...alertConfig} onClose={hideAlert} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: cardWidth,
    padding: 12,
    borderRadius: 2,
    transform: [{rotate: '-2deg'}],
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pinContainer: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    zIndex: 2,
    elevation: 6,
    alignItems: 'center',
  },
  pinHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2D2D2D',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  pinNeedle: {
    width: 2,
    height: 10,
    backgroundColor: '#1A1A1A',
    marginTop: -2,
  },
  contentContainer: {
    marginTop: 15,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: COLORS.text.primary,
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  selectedNote: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.8,
  },
});

export default NoteCard;
