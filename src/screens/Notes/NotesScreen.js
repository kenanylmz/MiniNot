import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  ImageBackground,
  Dimensions,
  Alert,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNotes} from '../../contexts/NoteContext';
import NoteCard from '../../components/NoteCard';
import {COLORS} from '../../utils/colors';
import {useCategories} from '../../contexts/CategoryContext';
import CustomAlert from '../../components/CustomAlert';
import {useCustomAlert} from '../../hooks/useCustomAlert';

const {width, height} = Dimensions.get('window');

const NotesScreen = ({navigation}) => {
  const {notes, deleteNote, updateNote} = useNotes();
  const {categories, deleteCategory, selectedCategory, setSelectedCategory} =
    useCategories();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const scaleValue = new Animated.Value(1);
  const {alertConfig, showAlert, hideAlert} = useCustomAlert();
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleCategoryLongPress = item => {
    if (item !== 'Genel') {
      showAlert({
        title: 'Kategori İşlemleri',
        message: 'Bu kategori için ne yapmak istersiniz?',
        type: 'info',
        buttons: [
          {
            text: 'Düzenle',
            onPress: () =>
              navigation.navigate('EditCategory', {category: item}),
          },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: () => deleteCategory(item),
          },
          {
            text: 'İptal',
            style: 'cancel',
            onPress: () => {},
          },
        ],
      });
    }
  };

  const handleNoteLongPress = note => {
    setIsSelectionMode(true);
    setSelectedNotes([note.id]);
  };

  const handleNotePress = note => {
    if (isSelectionMode) {
      setSelectedNotes(prev =>
        prev.includes(note.id)
          ? prev.filter(id => id !== note.id)
          : [...prev, note.id],
      );
    } else {
      navigation.navigate('EditNote', {note});
    }
  };

  const handleMoveNotes = targetCategory => {
    if (targetCategory === selectedCategory) {
      showAlert({
        title: 'Uyarı',
        message: 'Notlar zaten bu kategoride bulunuyor',
        type: 'warning',
        buttons: [{text: 'Tamam', onPress: () => {}}],
      });
      return;
    }

    showAlert({
      title: 'Notları Taşı',
      message: `${selectedNotes.length} notu "${targetCategory}" kategorisine taşımak istiyor musunuz?`,
      type: 'info',
      buttons: [
        {
          text: 'İptal',
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: 'Taşı',
          onPress: () => {
            try {
              const updatedNotes = notes.map(note => {
                if (selectedNotes.includes(note.id)) {
                  return {...note, category: targetCategory};
                }
                return note;
              });

              updateNote(null, null, updatedNotes);

              setSelectedNotes([]);
              setIsSelectionMode(false);
              showAlert({
                title: 'Başarılı',
                message: `${selectedNotes.length} not başarıyla taşındı`,
                type: 'success',
                buttons: [{text: 'Tamam', onPress: () => {}}],
              });
            } catch (error) {
              showAlert({
                title: 'Hata',
                message: 'Notlar taşınırken bir hata oluştu',
                type: 'error',
                buttons: [{text: 'Tamam', onPress: () => {}}],
              });
            }
          },
        },
      ],
    });
  };

  const handleSelectAll = () => {
    const currentCategoryNotes = notes.filter(
      note => note.category === selectedCategory,
    );
    if (selectedNotes.length === currentCategoryNotes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(currentCategoryNotes.map(note => note.id));
    }
  };

  const renderCategoryHeader = () => (
    <View style={styles.categoryHeader}>
      <FlatList
        horizontal
        data={categories}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item && styles.selectedCategory,
            ]}
            onPress={() => {
              if (isSelectionMode && selectedNotes.length > 0) {
                handleMoveNotes(item);
              } else {
                setSelectedCategory(item);
              }
            }}
            onLongPress={() => handleCategoryLongPress(item)}>
            <Icon
              name={item === 'Genel' ? 'notebook' : 'folder'}
              size={24}
              color="#8B4513"
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.selectedCategoryText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />
      <TouchableOpacity
        style={[
          styles.addCategoryButton,
          !isSelectionMode && {display: 'none'},
        ]}
        onPress={handleSelectAll}>
        <Icon
          name={
            selectedNotes.length ===
            notes.filter(note => note.category === selectedCategory).length
              ? 'checkbox-marked'
              : 'checkbox-blank-outline'
          }
          size={24}
          color="#8B4513"
        />
      </TouchableOpacity>
      {!isSelectionMode && (
        <TouchableOpacity
          style={styles.addCategoryButton}
          onPress={() => navigation.navigate('CreateCategory')}>
          <Icon name="plus" size={24} color="#8B4513" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="note-outline" size={64} color="#000000" />
      <Text style={styles.emptyText}>Henüz not eklenmemiş</Text>
      <Text style={styles.emptySubText}>
        Yeni not eklemek için + butonuna tıklayın
      </Text>
    </View>
  );

  // Post-it'lerin rastgele açılarla yerleşmesi için
  const getRandomRotation = () => {
    return Math.random() * 6 - 3; // -3 ile 3 derece arası
  };

  const renderNote = ({item, index}) => {
    const rotation = getRandomRotation();
    return (
      <View
        style={[styles.noteWrapper, {transform: [{rotate: `${rotation}deg`}]}]}>
        <NoteCard
          note={item}
          onPress={handleNotePress}
          onEdit={() => navigation.navigate('EditNote', {note: item})}
          onDelete={deleteNote}
          onLongPress={handleNoteLongPress}
          isSelected={selectedNotes.includes(item.id)}
        />
      </View>
    );
  };

  const handleDeleteCategory = categoryName => {
    showAlert({
      title: 'Kategori Silme',
      message:
        'Bu kategoriyi silmek istediğinizden emin misiniz? İçindeki notlar Genel kategorisine taşınacaktır.',
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
          onPress: () => {
            deleteCategory(categoryName);
            setSelectedCategory('Genel');
          },
        },
      ],
    });
  };

  // Seçim modundan çıkış için yeni fonksiyon
  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedNotes([]);
  };

  // Navigation'a back handler ekle
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      if (isSelectionMode) {
        // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Exit selection mode instead
        exitSelectionMode();
      }
    });

    return unsubscribe;
  }, [navigation, isSelectionMode]);

  // Boş alana tıklama için overlay'e onPress ekle
  const handleOverlayPress = () => {
    if (isSelectionMode) {
      exitSelectionMode();
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/mantarPano.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
        imageStyle={styles.backgroundImageStyle}>
        <View
          style={styles.overlay}
          onStartShouldSetResponder={() => {
            if (isSelectionMode) {
              handleOverlayPress();
            }
            return false;
          }}>
          {renderCategoryHeader()}
          <View style={{flex: 1}}>
            <FlatList
              data={notes.filter(note => note.category === selectedCategory)}
              renderItem={renderNote}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
              ListEmptyComponent={renderEmptyList}
              numColumns={2}
              columnWrapperStyle={styles.row}
              scrollEnabled={true}
              showsVerticalScrollIndicator={true}
              bounces={true}
              refreshControl={
                <RefreshControl
                  refreshing={false}
                  onRefresh={() => {}}
                  colors={[COLORS.primary]}
                  tintColor={COLORS.primary}
                />
              }
            />
          </View>
        </View>
      </ImageBackground>
      {!isSelectionMode && (
        <Animated.View style={{transform: [{scale: scaleValue}]}}>
          <TouchableOpacity
            style={styles.fab}
            onPress={() =>
              navigation.navigate('CreateNote', {category: selectedCategory})
            }>
            <Icon name="plus" size={24} color={COLORS.text.white} />
          </TouchableOpacity>
        </Animated.View>
      )}
      <CustomAlert {...alertConfig} onClose={hideAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEB887',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    quality: 1,
    opacity: 0.95,
    overlayColor: 'rgba(222, 184, 135, 0.05)',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  listContainer: {
    padding: 12,
    paddingBottom: 80,
    minHeight: '100%',
  },
  row: {
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  noteWrapper: {
    width: '45%',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    transform: [{rotate: `${Math.random() * 6 - 3}deg`}],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: '50%',
  },
  emptyText: {
    fontSize: 18,
    color: '#000000',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'System',
    fontWeight: '300',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  emptySubText: {
    fontSize: 14,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
    fontFamily: 'System',
    fontWeight: '300',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 152, 0, 0.45)',
    borderRadius: 12,
    margin: 8,
    padding: 8,
    shadowColor: '#8B4513',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#000000',
  },
  categoryList: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'rgba(139, 69, 19, 0.5)',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  selectedCategory: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  categoryText: {
    marginLeft: 8,
    color: '#8B4513',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: '#8B4513',
    fontWeight: '700',
  },
  addCategoryButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: '#000000',
  },
  addCategoryIcon: {
    color: '#8B4513',
  },
});

export default NotesScreen;
