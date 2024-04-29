/*
  Warnings:

  - You are about to drop the column `amenityId` on the `property` table. All the data in the column will be lost.
  - You are about to drop the column `bathroomCount` on the `property` table. All the data in the column will be lost.
  - You are about to drop the `_bookingtoproperty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bookingtouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_hosttoproperty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_propertytoreview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_propertytouser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_reviewtouser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bathRoomCount` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_bookingtoproperty` DROP FOREIGN KEY `_BookingToProperty_A_fkey`;

-- DropForeignKey
ALTER TABLE `_bookingtoproperty` DROP FOREIGN KEY `_BookingToProperty_B_fkey`;

-- DropForeignKey
ALTER TABLE `_bookingtouser` DROP FOREIGN KEY `_BookingToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_bookingtouser` DROP FOREIGN KEY `_BookingToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_hosttoproperty` DROP FOREIGN KEY `_HostToProperty_A_fkey`;

-- DropForeignKey
ALTER TABLE `_hosttoproperty` DROP FOREIGN KEY `_HostToProperty_B_fkey`;

-- DropForeignKey
ALTER TABLE `_propertytoreview` DROP FOREIGN KEY `_PropertyToReview_A_fkey`;

-- DropForeignKey
ALTER TABLE `_propertytoreview` DROP FOREIGN KEY `_PropertyToReview_B_fkey`;

-- DropForeignKey
ALTER TABLE `_propertytouser` DROP FOREIGN KEY `_PropertyToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_propertytouser` DROP FOREIGN KEY `_PropertyToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_reviewtouser` DROP FOREIGN KEY `_ReviewToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_reviewtouser` DROP FOREIGN KEY `_ReviewToUser_B_fkey`;

-- AlterTable
ALTER TABLE `property` DROP COLUMN `amenityId`,
    DROP COLUMN `bathroomCount`,
    ADD COLUMN `bathRoomCount` INTEGER NOT NULL,
    MODIFY `pricePerNight` DECIMAL(10, 2) NOT NULL;

-- DropTable
DROP TABLE `_bookingtoproperty`;

-- DropTable
DROP TABLE `_bookingtouser`;

-- DropTable
DROP TABLE `_hosttoproperty`;

-- DropTable
DROP TABLE `_propertytoreview`;

-- DropTable
DROP TABLE `_propertytouser`;

-- DropTable
DROP TABLE `_reviewtouser`;

-- CreateTable
CREATE TABLE `PropertyAmenity` (
    `propertyId` VARCHAR(191) NOT NULL,
    `amenityId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`propertyId`, `amenityId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Property` ADD CONSTRAINT `Property_hostId_fkey` FOREIGN KEY (`hostId`) REFERENCES `Host`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Property`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_amenityId_fkey` FOREIGN KEY (`amenityId`) REFERENCES `Amenity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
