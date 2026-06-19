import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
import CommonTextField from '../../components/CommonTextField';
import { AddVehicle, EditVehicle } from '../../app/features/vehicleSlice';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '../../components/Snackbar';

export default function AddVehicleScreen({ navigation, route }) {
    const { isEdit = false, vehicle = null } = route.params ?? {};
    const dispatch = useDispatch();
    const [vehicleImage, setVehicleImage] = useState(null);
    const [showImageOptions, setShowImageOptions] = useState(false);
    const [vehicleCompany, setVehicleCompany] = useState(null);
    const [vehicleModel, setVehicleModel] = useState(null);
    const [vehicleType, setVehicleType] = useState(null);
    const [plateNumber, setPlateNumber] = useState(null);
    const [vehicleColor, setVehicleColor] = useState(null);
    const [snack, setSnack] = useState({ visible: false, type: 'default', title: '', message: '' });

    useEffect(() => {
        console.log("Vehicle from edit screen :", vehicle);
        console.log("Vehicle from edit screen :", isEdit);

        if (vehicle) {
            setVehicleCompany(vehicle.make);
            setVehicleModel(vehicle.model);
            setVehicleType(vehicle.vehicleType);
            setPlateNumber(vehicle.licensePlate);
            setVehicleColor(vehicle.color);
        }
    }, [vehicle, isEdit]);


    const handleEditImage = () => setShowImageOptions(true);

    const openGallery = () => {
        setShowImageOptions(false);
        setTimeout(() => {
            launchImageLibrary(
                { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
                response => {
                    if (response.didCancel || response.errorCode) return;
                    const asset = response.assets?.[0];
                    if (asset?.uri) setVehicleImage(asset.uri);
                }
            );
        }, 300);
    };

    const openCamera = () => {
        setShowImageOptions(false);
        setTimeout(() => {
            launchCamera(
                { mediaType: 'photo', quality: 0.8, saveToPhotos: false },
                response => {
                    if (response.didCancel || response.errorCode) return;
                    const asset = response.assets?.[0];
                    if (asset?.uri) setVehicleImage(asset.uri);
                }
            );
        }, 300);
    };

    const handleEditVehicle = async () => {

        if (!vehicleCompany.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please enter vehicle company.' });
            return;
        }
        if (!vehicleModel.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please enter vehicle model.' });
            return;
        }
        if (!vehicleType.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please enter vehicle type (Sedan, Suv etc.).' });
            return;
        }
        if (!plateNumber.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please submit your vehicle plate number.' });
            return;
        }

        if (!vehicleColor.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please submit your vehicle color.' });
            return;
        }
        try {
            const vehicleData = {
                "make": vehicleCompany,
                "model": vehicleModel,
                "vehicleType": vehicleType,
                "licensePlate": plateNumber,
                "color": vehicleColor
            }

            console.log("vehicleData : ", vehicleData);
            const response = await dispatch(EditVehicle({ vehicleData, id: vehicle._id })).unwrap();
            console.log("Response : ", response);
            if (response.status === 'success' || response.message) {
                setSnack({ visible: true, type: 'success', title: 'Vehicle Edited Successfully!', message: 'Your vehicle edited successfully.' });
                navigation.goBack();
            }
        } catch (error) {
            console.log("Error : ", error);
            setSnack({ visible: true, type: 'error', title: 'Error', message: error ?? 'Failed to Edit Vehicle.' });
        }

    };

    const handleAddVehicle = async () => {

        if (!vehicleCompany.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please enter vehicle company.' });
            return;
        }
        if (!vehicleModel.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please enter vehicle model.' });
            return;
        }
        if (!vehicleType.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please enter vehicle type (Sedan, Suv etc.).' });
            return;
        }
        if (!plateNumber.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please submit your vehicle plate number.' });
            return;
        }

        if (!vehicleColor.trim()) {
            setSnack({ visible: true, type: 'error', title: 'Error', message: 'Please submit your vehicle color.' });
            return;
        }
        try {
            const vehicleData = {
                "make": vehicleCompany,
                "model": vehicleModel,
                "vehicleType": vehicleType,
                "licensePlate": plateNumber,
                "color": vehicleColor
            }

            console.log("vehicleData : ", vehicleData);
            const response = await dispatch(AddVehicle(vehicleData)).unwrap();
            console.log("Response : ", response);
            if (response.status === 'success' || response.message) {
                setSnack({ visible: true, type: 'success', title: 'Vehicle Added Successfully!', message: 'Your vehicle added successfully.' });
                navigation.goBack();
            }
        } catch (error) {
            console.log("Error : ", error);
            setSnack({ visible: true, type: 'error', title: 'Error', message: error ?? 'Failed to Add Vehicle.' });
        }

    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>{isEdit ? "Edit Vehicle" : "Add Vehicle"}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.avatarContainer}>
                    <View style={styles.avatarWrapper}>
                        <Image
                            source={
                                vehicleImage
                                    ? { uri: vehicleImage }
                                    : require('../../assets/images/car.png')
                            }
                            style={styles.vehicleImage}
                            resizeMode='cover'
                        />
                    </View>
                    <TouchableOpacity style={styles.editImageButton} onPress={handleEditImage}>
                        <MaterialDesignIcons name="edit" size={14} color={colors.whiteColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Vehicle Company</Text>
                    <CommonTextField placeholder={'e.g. Toyota, Honda'} value={vehicleCompany} onChangeText={setVehicleCompany} isEditable={!isEdit} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Vehicle Model</Text>
                    <CommonTextField placeholder={'e.g. Camry, CR-V'} value={vehicleModel} onChangeText={setVehicleModel} isEditable={!isEdit} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Vehicle Type</Text>
                    <CommonTextField placeholder={'e.g. Sedan, SUV, Bike'} value={vehicleType} onChangeText={setVehicleType} isEditable={!isEdit} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Plate Number</Text>
                    <CommonTextField placeholder={'e.g. LG 234 ABC'} value={plateNumber} onChangeText={setPlateNumber} isEditable={!isEdit} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Vehicle Color</Text>
                    <CommonTextField placeholder={'e.g. Black, White, Silver'} value={vehicleColor} onChangeText={setVehicleColor} />
                </View>

                <CommonButton
                    title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
                    textColor={colors.whiteColor}
                    color={colors.secondaryColor}
                    style={styles.submitButton}
                    onPress={isEdit ? handleEditVehicle : handleAddVehicle}
                />
            </ScrollView>

            <Modal
                visible={showImageOptions}
                transparent
                animationType="fade"
                onRequestClose={() => setShowImageOptions(false)}
            >
                <Pressable style={styles.alertOverlay} onPress={() => setShowImageOptions(false)}>
                    <Pressable style={styles.alertBox} onPress={() => { }}>

                        <View style={styles.alertIconCircle}>
                            <MaterialDesignIcons name="add-a-photo" size={26} color={colors.primaryColor} />
                        </View>

                        <Text style={styles.alertTitle}>{isEdit ? 'Edit' : 'Add'} Vehicle Photo</Text>
                        <Text style={styles.alertSubtitle}>Choose how you'd like to {isEdit ? 'edit' : 'add'} your vehicle picture</Text>

                        <View style={styles.alertDivider} />

                        <TouchableOpacity style={styles.alertOptionRow} onPress={openCamera}>
                            <View style={styles.alertOptionIcon}>
                                <MaterialDesignIcons name="camera-alt" size={20} color={colors.primaryColor} />
                            </View>
                            <Text style={styles.alertOptionText}>Take Photo</Text>
                        </TouchableOpacity>

                        <View style={styles.alertOptionDivider} />

                        <TouchableOpacity style={styles.alertOptionRow} onPress={openGallery}>
                            <View style={styles.alertOptionIcon}>
                                <MaterialDesignIcons name="photo-library" size={20} color={colors.primaryColor} />
                            </View>
                            <Text style={styles.alertOptionText}>Choose from Gallery</Text>
                        </TouchableOpacity>

                        <View style={styles.alertDivider} />

                        <TouchableOpacity
                            style={styles.alertCancelRow}
                            onPress={() => setShowImageOptions(false)}
                        >
                            <Text style={styles.alertCancelText}>Cancel</Text>
                        </TouchableOpacity>

                    </Pressable>
                </Pressable>
            </Modal>
            <Snackbar
                {...snack}
                onDismiss={() => setSnack(s => ({ ...s, visible: false }))}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.primaryColor,
        paddingTop: 60,
    },
    scrollContent: {
        flexGrow: 1,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
        paddingBottom: 50,
    },
    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 4,
    },
    screenTitle: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '600',
        color: colors.whiteColor,
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 24,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        marginBottom: 24,
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    vehicleImage: {
        width: 105,
        height: 105,
        borderRadius: 16,
    },
    editImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: colors.secondaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primaryColor,
    },
    fieldGroup: {
        width: '100%',
        gap: 8,
    },
    fieldGroupSpaced: {
        width: '100%',
        gap: 8,
        marginTop: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        color: colors.whiteColor,
    },
    submitButton: {
        marginTop: 40,
        width: '100%',
    },
    alertOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    alertBox: {
        width: '100%',
        backgroundColor: colors.whiteColor,
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        paddingTop: 24,
    },
    alertIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.lightPurpleColor,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primaryColor,
        marginBottom: 6,
    },
    alertSubtitle: {
        fontSize: 13,
        color: colors.darkGrey,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    alertDivider: {
        height: 0.5,
        backgroundColor: colors.lightGreyColor,
        width: '100%',
    },
    alertOptionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 24,
    },
    alertOptionIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.lightPurpleColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertOptionText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.primaryColor,
    },
    alertOptionDivider: {
        height: 0.5,
        backgroundColor: colors.lightGreyColor,
        width: '100%',
    },
    alertCancelRow: {
        width: '100%',
        paddingVertical: 15,
        alignItems: 'center',
    },
    alertCancelText: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.darkGrey,
    },
});