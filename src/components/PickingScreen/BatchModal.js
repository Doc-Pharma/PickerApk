import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { CloseIcon, CheckIcon } from '../../assets/Icons';
import Button from '../common/Button';
import Colors from '../../theme/colors';

const BatchModal = ({
  visible,
  batches = [],
  onConfirm,
  onClose,
  loading = false,
}) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!visible) setSelected(null);
  }, [visible]);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.handle} />

          <View style={s.header}>
            <Text style={s.headerTitle}>Select Batch</Text>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
            >
              <CloseIcon color={Colors.g500} size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
            {loading ? (
              <View style={s.empty}>
                <ActivityIndicator size="small" color={Colors.pk} />
                <Text style={s.emptyText}>Loading batches…</Text>
              </View>
            ) : batches.length === 0 ? (
              <View style={s.empty}>
                <Text style={s.emptyText}>
                  No batches found for this product.
                </Text>
                <Text style={s.emptyHint}>
                  Ask your supervisor or enter the batch manually.
                </Text>
              </View>
            ) : null}

            {batches.map(batch => {
              const sel = selected?.id === batch.id;
              return (
                <TouchableOpacity
                  key={batch.id}
                  style={[s.batchRow, sel && s.batchRowSel]}
                  onPress={() => setSelected(batch)}
                  activeOpacity={0.75}
                >
                  <View>
                    <Text style={[s.batchId, sel && { color: Colors.pk }]}>
                      {batch.label}
                    </Text>
                    <Text style={s.batchExpiry}>Expiry: {batch.expiry}</Text>
                  </View>
                  <View
                    style={[
                      s.radio,
                      sel && {
                        borderColor: Colors.pk,
                        backgroundColor: Colors.pk,
                      },
                    ]}
                  >
                    {sel && <CheckIcon color={Colors.white} size={10} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={s.footer}>
            <Button
              title="Confirm Batch"
              variant="picking"
              onPress={handleConfirm}
              disabled={!selected}
            />
            <Button
              title="Cancel"
              variant="ghost"
              onPress={handleClose}
              style={{ marginTop: 8 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BatchModal;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
    maxHeight: '82%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.g300,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.g100,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.g900 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.g100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: { maxHeight: 280, paddingHorizontal: 20, paddingTop: 8 },
  empty: { paddingVertical: 32, alignItems: 'center', gap: 8 },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.g700,
    textAlign: 'center',
  },
  emptyHint: { fontSize: 12, color: Colors.g500, textAlign: 'center' },
  batchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.g100,
    marginBottom: 8,
    backgroundColor: Colors.g50,
  },
  batchRowSel: { borderColor: Colors.pk, backgroundColor: Colors.pkLight },
  batchId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.g900,
    fontFamily: 'monospace',
  },
  batchExpiry: { fontSize: 12, color: Colors.g500, marginTop: 3 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.g300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { paddingHorizontal: 20, paddingTop: 16 },
});
