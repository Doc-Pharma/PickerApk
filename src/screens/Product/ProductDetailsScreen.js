import React, { useCallback } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { TopBar, Button, InfoRow } from '../../components';
import { InfoIcon } from '../../assets/Icons';
import Colors from '../../theme/colors';
import Routes from '../../navigation/routes';
import { formatExpiryDate } from '../../utils/helpers';

const ProductDetailsScreen = ({ navigation, route }) => {
  const productData = route?.params?.productData;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      StatusBar.setBackgroundColor(Colors.white);
    }, []),
  );

  if (!productData) {
    return (
      <View style={styles.safe}>
        <TopBar title="Product Details" onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <Text style={styles.errorText}>Product details not found</Text>
        </View>
      </View>
    );
  }

  const {
    product,
    inventory,
    partner,
    partner_sku_id,
    invoice_number,
    batch_number,
    mrp,
    quantity,
    expiry_date,
    location,
    putaway_status,
    assigned_picker_putter,
  } = productData;

  const available_qty = inventory?.inventory_count ?? quantity ?? null;
  const display_batch = inventory?.batch_no ?? batch_number ?? null;
  const display_expiry = formatExpiryDate(inventory?.exp_date ?? expiry_date);
  const display_mrp = inventory?.mrp ?? mrp ?? null;
  const display_location = inventory?.locn ?? location ?? null;
  const is_putaway_completed = putaway_status === 'COMPLETED';

  return (
    <View style={styles.safe}>
      <TopBar title="Product Details" onBack={() => navigation.goBack()} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Product Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Product Details</Text>
          <InfoRow label="Product Name" value={product?.name} />
          <InfoRow label="DPID" value={product?.dp_id} />
          <InfoRow label="Pack Size" value={product?.pack_size} />
          <InfoRow label="Manufacturer" value={product?.manufacturer} />
          <InfoRow
            label="MRP"
            value={display_mrp ? `₹${display_mrp}` : null}
            last
          />
        </View>

        {/* Batch Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Batch Details</Text>
          <InfoRow label="Batch Number" value={display_batch} />
          <InfoRow label="Available QTY" value={available_qty} />
          <InfoRow label="Expiry Date" value={display_expiry} last />
        </View>

        {/* Partner Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Partner Details</Text>
          <InfoRow label="Partner Name" value={partner?.name} />
          <InfoRow label="Partner SKU ID" value={partner_sku_id} />
          <InfoRow label="Invoice Number" value={invoice_number} last />
        </View>

        {/* Warehouse Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Warehouse Details</Text>
          <InfoRow
            label="Location (Bin)"
            value={display_location}
            valueStyle={styles.locationValue}
          />
          <InfoRow
            label="Assigned Picker Name"
            value={assigned_picker_putter}
          />
          <InfoRow label="Putaway Status" value={putaway_status} last />
        </View>

        {/* Verify Putaway */}
        {is_putaway_completed && (
          <View style={styles.verifySection}>
            <Button
              title="Verify Putaway"
              variant="primary"
              onPress={() =>
                navigation.navigate(Routes.PRODUCT_VERIFY_LOCATION, {
                  productId: product?.id,
                  partnerId: partner?.id,
                  batchNumber: display_batch,
                  expectedLocation: display_location,
                })
              }
            />
            <View style={styles.verifyInfo}>
              <InfoIcon width={14} height={14} color={Colors.blue} />
              <Text style={styles.verifyHint}>
                Scan Location QR to Verify Putaway
              </Text>
            </View>
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.g50,
  },
  container: {
    paddingBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.navy,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.g100,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.g500,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    paddingTop: 14,
    paddingBottom: 6,
  },
  locationValue: {
    color: Colors.blue,
  },
  verifySection: {
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  verifyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 8,
  },
  verifyHint: {
    fontSize: 12,
    color: Colors.blue,
    textAlign: 'center',
  },
  bottomSpace: {
    height: 30,
  },
});
