import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import MaterialDesignIcons from '@react-native-vector-icons/material-icons';
import colors from '../../common/Colors';
import CommonButton from '../../components/CommonButton';
import CommonTextField from '../../components/CommonTextField';

export default function EditProfileScreen({ navigation }) {
    const [profileImage, setProfileImage] = useState(null);
    const [showImageOptions, setShowImageOptions] = useState(false);

    const handleEditImage = () => setShowImageOptions(true);

    const openGallery = () => {
        setShowImageOptions(false);
        setTimeout(() => {
            launchImageLibrary(
                { mediaType: 'photo', quality: 0.8, selectionLimit: 1 },
                response => {
                    if (response.didCancel || response.errorCode) return;
                    const asset = response.assets?.[0];
                    if (asset?.uri) setProfileImage(asset.uri);
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
                    if (asset?.uri) setProfileImage(asset.uri);
                }
            );
        }, 300);
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <View style={styles.screenHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialDesignIcons name="arrow-back-ios" size={24} color={colors.whiteColor} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Edit Profile</Text>
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
                                profileImage
                                    ? { uri: profileImage }
                                    : require('../../assets/images/profile.png')
                            }
                            style={styles.profileImage}
                        />
                    </View>
                    <TouchableOpacity style={styles.editImageButton} onPress={handleEditImage}>
                        <MaterialDesignIcons name="edit" size={14} color={colors.whiteColor} />
                    </TouchableOpacity>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    <CommonTextField placeholder={'Please Enter Your Name.'} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <CommonTextField placeholder={'Please Enter Your Email.'} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Mobile Number</Text>
                    <CommonTextField placeholder={'Please Enter Your Mobile Number.'} />
                </View>

                <View style={styles.fieldGroupSpaced}>
                    <Text style={styles.fieldLabel}>Address</Text>
                    <CommonTextField placeholder={'Please Enter Your Address.'} />
                </View>

                <CommonButton
                    title={'Submit'}
                    textColor={colors.whiteColor}
                    color={colors.secondaryColor}
                    style={styles.submitButton}
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

                        <Text style={styles.alertTitle}>Update Profile Photo</Text>
                        <Text style={styles.alertSubtitle}>Choose how you'd like to update your picture</Text>

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
    profileImage: {
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