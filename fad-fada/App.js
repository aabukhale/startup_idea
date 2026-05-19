import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useState, useRef } from 'react';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [mood, setMood] = useState(null);
  const [ventType, setVentType] = useState('write');
  const [lockDuration, setLockDuration] = useState('1 week');
  const [text, setText] = useState('');

  // Audio
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDone, setRecordingDone] = useState(false);

  // Camera
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoDone, setVideoDone] = useState(false);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (e) {
      Alert.alert('Error', 'Could not start recording');
    }
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    setRecording(null);
    setIsRecording(false);
    setRecordingDone(true);
  }

  async function startVideoRecording() {
    if (!cameraPermission?.granted) {
      await requestCameraPermission();
    }
    setShowCamera(true);
  }

  async function stopVideoRecording() {
    if (cameraRef.current && isRecordingVideo) {
      await cameraRef.current.stopRecording();
      setIsRecordingVideo(false);
      setVideoDone(true);
      setShowCamera(false);
    }
  }

  if (showCamera) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          mode="video"
          facing="front"
          onCameraReady={() => {
            cameraRef.current.recordAsync().then(() => {});
            setIsRecordingVideo(true);
          }}
        />
        <TouchableOpacity style={styles.stopVideoBtn} onPress={stopVideoRecording}>
          <Text style={styles.stopVideoBtnText}>⏹ Stop Recording</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (screen === 'vent') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.moodSelected}>Feeling: {mood?.icon} {mood?.text}</Text>

        <Text style={styles.label}>How do you want to vent?</Text>
        <View style={styles.ventRow}>
          {[
            { id: 'write', icon: '✍️', text: 'Write' },
            { id: 'audio', icon: '🎙️', text: 'Audio' },
            { id: 'video', icon: '🎥', text: 'Video' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.ventBtn, ventType === item.id && styles.ventBtnActive]}
              onPress={() => setVentType(item.id)}
            >
              <Text style={styles.ventIcon}>{item.icon}</Text>
              <Text style={styles.ventText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Write */}
        {ventType === 'write' && (
          <TextInput
            style={styles.textArea}
            placeholder="What's on your mind tonight..."
            placeholderTextColor="#444"
            multiline
            value={text}
            onChangeText={setText}
          />
        )}

        {/* Audio */}
        {ventType === 'audio' && (
          <View style={styles.recordCard}>
            <Text style={styles.recordStatus}>
              {recordingDone ? '✅ Recording saved!' : isRecording ? '🔴 Recording...' : '🎙️ Ready to record'}
            </Text>
            <TouchableOpacity
              style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={styles.recordBtnText}>
                {isRecording ? '⏹ Stop' : '🎙️ Start Recording'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Video */}
        {ventType === 'video' && (
          <View style={styles.recordCard}>
            <Text style={styles.recordStatus}>
              {videoDone ? '✅ Video saved!' : '🎥 Ready to record'}
            </Text>
            <TouchableOpacity style={styles.recordBtn} onPress={startVideoRecording}>
              <Text style={styles.recordBtnText}>🎥 Open Camera</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>💬 Message to future you</Text>
          <TextInput
            style={styles.questionInput}
            placeholder="What do you want to tell yourself later?"
            placeholderTextColor="#444"
            multiline
          />
        </View>

        <Text style={styles.label}>Lock this capsule for</Text>
        <View style={styles.lockRow}>
          {['1 week', '1 month', '6 months', '1 year'].map((d) => (
            <TouchableOpacity
              key={d}
              style={[styles.lockBtn, lockDuration === d && styles.lockBtnActive]}
              onPress={() => setLockDuration(d)}
            >
              <Text style={[styles.lockText, lockDuration === d && styles.lockTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={() => setScreen('capsules')}>
          <Text style={styles.mainBtnText}>Lock Capsule 🔒</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (screen === 'capsules') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity onPress={() => setScreen('home')}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Capsules 🗝️</Text>

        <Text style={styles.label}>Locked (2)</Text>

        <View style={[styles.capsuleCard, { borderLeftColor: '#6b4bc2' }]}>
          <Text style={styles.capDate}>May 15, 2026</Text>
          <Text style={styles.capMood}>😔</Text>
          <View style={styles.capBadgeLocked}>
            <Text style={styles.capBadgeLockedText}>Locked</Text>
          </View>
          <Text style={styles.capTimer}>Opens in 16 days</Text>
        </View>

        <View style={[styles.capsuleCard, { borderLeftColor: '#6b4bc2' }]}>
          <Text style={styles.capDate}>April 2, 2026</Text>
          <Text style={styles.capMood}>😶‍🌫️</Text>
          <View style={styles.capBadgeLocked}>
            <Text style={styles.capBadgeLockedText}>Locked</Text>
          </View>
          <Text style={styles.capTimer}>Opens in 5 months</Text>
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Ready to Open (1)</Text>

        <View style={[styles.capsuleCard, { borderLeftColor: '#4bc28a' }]}>
          <Text style={styles.capDate}>February 19, 2026</Text>
          <Text style={styles.capMood}>😞</Text>
          <View style={styles.capBadgeUnlocked}>
            <Text style={styles.capBadgeUnlockedText}>Ready!</Text>
          </View>
          <Text style={[styles.capTimer, { color: '#4bc28a' }]}>See how you've changed</Text>
        </View>

        <TouchableOpacity style={styles.mainBtn} onPress={() => setScreen('home')}>
          <Text style={styles.mainBtnText}>+ New Capsule</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.moon}>🌙</Text>
      <Text style={styles.title}>fadfdaa</Text>
      <Text style={styles.subtitle}>How are you feeling tonight?</Text>

      <View style={styles.socialCard}>
        <Text style={styles.socialNum}>1,847</Text>
        <Text style={styles.socialText}>others are sharing tonight</Text>
      </View>

      <Text style={styles.label}>How are you feeling?</Text>
      <View style={styles.feelingsGrid}>
        {[
          { icon: '😔', text: 'Heavy' },
          { icon: '😶‍🌫️', text: 'Confused' },
          { icon: '😞', text: 'Tired' },
          { icon: '🙂', text: 'Okay' },
        ].map((item) => (
          <TouchableOpacity
            key={item.text}
            style={[styles.feelingBtn, mood?.text === item.text && styles.feelingBtnActive]}
            onPress={() => setMood(item)}
          >
            <Text style={styles.feelingIcon}>{item.icon}</Text>
            <Text style={styles.feelingText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.mainBtn} onPress={() => mood && setScreen('vent')}>
        <Text style={styles.mainBtnText}>Start Venting →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', padding: 24 },
  moon: { fontSize: 40, textAlign: 'center', marginTop: 60 },
  title: { fontSize: 28, color: '#c8b8f5', textAlign: 'center', fontWeight: '600', marginTop: 8, marginBottom: 16 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  socialCard: { backgroundColor: '#1e2a3a', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24 },
  socialNum: { fontSize: 28, color: '#5ba3d4', fontWeight: '600' },
  socialText: { fontSize: 12, color: '#888', marginTop: 4 },
  label: { color: '#888', fontSize: 13, marginBottom: 10 },
  feelingsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  feelingBtn: { backgroundColor: '#252540', borderRadius: 12, padding: 16, alignItems: 'center', width: '47%' },
  feelingBtnActive: { backgroundColor: '#3d2f6e', borderWidth: 1, borderColor: '#7c5cbf' },
  feelingIcon: { fontSize: 24 },
  feelingText: { color: '#aaa', fontSize: 12, marginTop: 6 },
  mainBtn: { backgroundColor: '#6b4bc2', borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 40, marginTop: 8 },
  mainBtnText: { color: '#e8dfff', fontSize: 16, fontWeight: '600' },
  back: { color: '#888', fontSize: 14, marginTop: 40, marginBottom: 20 },
  moodSelected: { color: '#c8b8f5', fontSize: 14, marginBottom: 20 },
  ventRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  ventBtn: { flex: 1, backgroundColor: '#252540', borderRadius: 12, padding: 12, alignItems: 'center' },
  ventBtnActive: { backgroundColor: '#3d2f6e', borderWidth: 1, borderColor: '#7c5cbf' },
  ventIcon: { fontSize: 20 },
  ventText: { color: '#888', fontSize: 11, marginTop: 4 },
  textArea: { backgroundColor: '#252540', borderRadius: 12, padding: 16, color: '#fff', fontSize: 14, minHeight: 120, marginBottom: 16, textAlignVertical: 'top' },
  questionCard: { backgroundColor: '#1a2a3a', borderRadius: 12, padding: 16, marginBottom: 16, borderLeftWidth: 2, borderLeftColor: '#5ba3d4' },
  questionLabel: { color: '#8ab8d4', fontSize: 12, marginBottom: 8 },
  questionInput: { color: '#fff', fontSize: 13, minHeight: 60, textAlignVertical: 'top' },
  lockRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  lockBtn: { backgroundColor: '#252540', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  lockBtnActive: { backgroundColor: '#3d2f6e', borderWidth: 1, borderColor: '#7c5cbf' },
  lockText: { color: '#888', fontSize: 12 },
  lockTextActive: { color: '#c8b8f5' },
  capsuleCard: { backgroundColor: '#252540', borderRadius: 12, padding: 16, marginBottom: 10, borderLeftWidth: 3 },
  capDate: { color: '#666', fontSize: 11, marginBottom: 4 },
  capMood: { fontSize: 20, marginBottom: 6 },
  capBadgeLocked: { backgroundColor: '#3d2f6e', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 6 },
  capBadgeLockedText: { color: '#c8b8f5', fontSize: 11 },
  capBadgeUnlocked: { backgroundColor: '#1e4035', borderRadius: 6, paddingVertical: 3, paddingHorizontal: 10, alignSelf: 'flex-start', marginBottom: 6 },
  capBadgeUnlockedText: { color: '#4bc28a', fontSize: 11 },
  capTimer: { color: '#666', fontSize: 11 },
  recordCard: { backgroundColor: '#252540', borderRadius: 12, padding: 20, marginBottom: 16, alignItems: 'center' },
  recordStatus: { color: '#aaa', fontSize: 13, marginBottom: 16 },
  recordBtn: { backgroundColor: '#6b4bc2', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 24 },
  recordBtnActive: { backgroundColor: '#a03030' },
  recordBtnText: { color: '#e8dfff', fontSize: 14, fontWeight: '600' },
  stopVideoBtn: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#a03030', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  stopVideoBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});