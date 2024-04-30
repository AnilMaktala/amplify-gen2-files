import "./App.css";
import { generateClient } from "aws-amplify/api";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import React, { useState } from "react";

import type { Schema } from "../amplify/data/resource";

import "@aws-amplify/ui-react/styles.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

// Generating the client
const client = generateClient<Schema>({
  authMode: "apiKey",
});

function App({ signOut, user }) {
  // State to hold the recognized text
  const [currentPhotoAlbum, setCurrentPhotoAlbum] = useState<PhotoAlbum | null>(
    null
  );

  // Used to display images for current photoAlbum:
  const [currentImages, setCurrentImages] = useState<
    (string | null | undefined)[] | null | undefined
  >([]);

  async function createPhotoAlbumWithFirstImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      // Create the API record:
      const response = await client.models.PhotoAlbum.create({
        name: `My first photoAlbum`,
      });

      const photoAlbum = response.data;

      if (!photoAlbum) return;

      // Upload the Storage file:
      const result = await uploadData({
        key: `${photoAlbum.id}-${file.name}`,
        data: file,
        options: {
          contentType: "image/png", // contentType is optional
        },
      }).result;

      const updatePhotoAlbumDetails = {
        id: photoAlbum.id,
        imageKeys: [result.key],
      };

      // Add the file association to the record:
      const updateResponse = await client.models.PhotoAlbum.update({
        id: photoAlbum.id,
        imageKeys: [result.key],
      });

      const updatedPhotoAlbum = updateResponse.data;

      setCurrentPhotoAlbum(updatedPhotoAlbum);

      // If the record has no associated file, we can return early.
      if (!updatedPhotoAlbum.imageKeys?.length) return;

      // Retrieve the file's signed URL:
      const signedURL = await getUrl({ key: updatedPhotoAlbum.imageKeys[0]! });
      setCurrentImages([signedURL.url.toString()]);
    } catch (error) {
      console.error("Error create photoAlbum / file:", error);
    }
  }

  async function createPhotoAlbumWithMultipleImages(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    try {
      const photoAlbumDetails = {
        name: `My first photoAlbum`,
      };

      // Create the API record:
      const response = await client.models.PhotoAlbum.create({
        name: `My first photoAlbum`,
      });

      const photoAlbum = response.data;

      if (!photoAlbum) return;

      // Upload all files to Storage:
      const imageKeys = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const result = await uploadData({
            key: `${photoAlbum.id}-${file.name}`,
            data: file,
            options: {
              contentType: "image/png", // contentType is optional
            },
          }).result;

          return result.key;
        })
      );

      // Add the file association to the record:
      const updateResponse = await client.models.PhotoAlbum.update({
        id: photoAlbum.id,
        imageKeys: imageKeys,
      });
      const updatedPhotoAlbum = updateResponse.data;

      setCurrentPhotoAlbum(updatedPhotoAlbum);

      // If the record has no associated file, we can return early.
      if (!updatedPhotoAlbum.imageKeys?.length) return;

      // Retrieve signed urls for all files:
      const signedUrls = await Promise.all(
        updatedPhotoAlbum.imageKeys.map(
          async (key) => await getUrl({ key: key! })
        )
      );

      if (!signedUrls) return;
      setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
    } catch (error) {
      console.error("Error create photoAlbum / file:", error);
    }
  }

  async function addNewImagesToPhotoAlbum(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!currentPhotoAlbum) return;

    if (!e.target.files) return;

    try {
      // Upload all files to Storage:
      const newImageKeys = await Promise.all(
        Array.from(e.target.files).map(async (file) => {
          const result = await uploadData({
            key: `${currentPhotoAlbum.id}-${file.name}`,
            data: file,
            options: {
              contentType: "image/png", // contentType is optional
            },
          }).result;

          return result.key;
        })
      );

      // Query existing record to retrieve currently associated files:
      const queriedResponse = await client.models.PhotoAlbum.get({
        id: currentPhotoAlbum.id,
      });

      const photoAlbum = queriedResponse.data;

      if (!photoAlbum?.imageKeys) return;

      // Merge existing and new file keys:
      const updatedImageKeys = [...newImageKeys, ...photoAlbum.imageKeys];

      // Update record with merged file associations:
      const response = await client.models.PhotoAlbum.update({
        id: currentPhotoAlbum.id,
        imageKeys: updatedImageKeys,
      });

      const updatedPhotoAlbum = response.data;
      setCurrentPhotoAlbum(updatedPhotoAlbum);

      // If the record has no associated file, we can return early.
      if (!updatedPhotoAlbum?.imageKeys) return;

      // Retrieve signed urls for merged image keys:
      const signedUrls = await Promise.all(
        updatedPhotoAlbum?.imageKeys.map(
          async (key) => await getUrl({ key: key! })
        )
      );

      if (!signedUrls) return;

      setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
    } catch (error) {
      console.error(
        "Error uploading image / adding image to photoAlbum: ",
        error
      );
    }
  }

  // Replace last image associated with current photoAlbum:
  async function updateLastImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentPhotoAlbum) return;

    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      // Upload new file to Storage:
      const result = await uploadData({
        key: `${currentPhotoAlbum.id}-${file.name}`,
        data: file,
        options: {
          contentType: "image/png", // contentType is optional
        },
      }).result;

      const newFileKey = result.key;

      // Query existing record to retrieve currently associated files:
      const queriedResponse = await client.models.PhotoAlbum.get({
        id: currentPhotoAlbum.id,
      });

      const photoAlbum = queriedResponse.data;

      if (!photoAlbum?.imageKeys?.length) return;

      // Retrieve last image key:
      const [lastImageKey] = photoAlbum.imageKeys.slice(-1);

      // Remove last file association by key
      const updatedImageKeys = [
        ...photoAlbum.imageKeys.filter((key) => key !== lastImageKey),
        newFileKey,
      ];

      // Update record with updated file associations:
      const response = await client.models.PhotoAlbum.update({
        id: currentPhotoAlbum.id,
        imageKeys: updatedImageKeys,
      });

      const updatedPhotoAlbum = response.data;

      setCurrentPhotoAlbum(updatedPhotoAlbum);

      // If the record has no associated file, we can return early.
      if (!updatedPhotoAlbum?.imageKeys) return;

      // Retrieve signed urls for merged image keys:
      const signedUrls = await Promise.all(
        updatedPhotoAlbum?.imageKeys.map(
          async (key) => await getUrl({ key: key! })
        )
      );

      if (!signedUrls) return;

      setCurrentImages(signedUrls.map((signedUrl) => signedUrl.url.toString()));
    } catch (error) {
      console.error(
        "Error uploading image / adding image to photoAlbum: ",
        error
      );
    }
  }

  async function getImagesForPhotoAlbum() {
    if (!currentPhotoAlbum) {
      return;
    }
    try {
      // Query the record to get the file keys:
      const response = await client.models.PhotoAlbum.get({
        id: currentPhotoAlbum.id,
      });
      const photoAlbum = response.data;

      // If the record has no associated files, we can return early.
      if (!photoAlbum?.imageKeys) return;

      // Retrieve the signed URLs for the associated images:
      const signedUrls = await Promise.all(
        photoAlbum.imageKeys.map(async (imageKey) => {
          if (!imageKey) return;
          return await getUrl({ key: imageKey });
        })
      );

      setCurrentImages(
        signedUrls.map((signedUrl) => signedUrl?.url.toString())
      );
    } catch (error) {
      console.error("Error getting photoAlbum / image:", error);
    }
  }

  // Remove the file associations, continue to persist both files and record
  async function removeImagesFromPhotoAlbum() {
    if (!currentPhotoAlbum) return;

    try {
      const response = await client.models.PhotoAlbum.get({
        id: currentPhotoAlbum.id,
      });

      const photoAlbum = response.data;

      // If the record has no associated file, we can return early.
      if (!photoAlbum?.imageKeys) return;

      const updatedPhotoAlbum = await client.models.PhotoAlbum.update({
        id: photoAlbum.id,
        imageKeys: null,
      });

      // If successful, the response here will be `null`:
      setCurrentPhotoAlbum(updatedPhotoAlbum.data);
      setCurrentImages(updatedPhotoAlbum.data?.imageKeys);
    } catch (error) {
      console.error("Error removing image from photoAlbum: ", error);
    }
  }

  // Remove the record association and delete the file
  async function deleteImagesForCurrentPhotoAlbum() {
    if (!currentPhotoAlbum) return;

    try {
      const response = await client.models.PhotoAlbum.get({
        id: currentPhotoAlbum.id,
      });

      const photoAlbum = response.data;

      // If the record has no associated files, we can return early.
      if (!photoAlbum?.imageKeys) return;

      // Remove associated files from record
      const updateResponse = await client.models.PhotoAlbum.update({
        id: photoAlbum.id,
        imageKeys: null, // Set the file association to `null`
      });

      const updatedPhotoAlbum = updateResponse.data;

      // Delete the files from S3:
      await Promise.all(
        photoAlbum?.imageKeys.map(async (imageKey) => {
          if (!imageKey) return;
          await remove({ key: imageKey });
        })
      );

      // If successful, the response here will be `null`:
      setCurrentPhotoAlbum(updatedPhotoAlbum);
      setCurrentImages(null);
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  }

  // Delete both files and record
  async function deleteCurrentPhotoAlbumAndImages() {
    if (!currentPhotoAlbum) return;

    try {
      const response = await client.models.PhotoAlbum.get({
        id: currentPhotoAlbum.id,
      });

      const photoAlbum = response.data;

      if (!photoAlbum) return;

      await client.models.PhotoAlbum.delete({
        id: photoAlbum.id,
      });

      setCurrentPhotoAlbum(null);

      // If the record has no associated file, we can return early.
      if (!photoAlbum?.imageKeys) return;

      await Promise.all(
        photoAlbum?.imageKeys.map(async (imageKey) => {
          if (!imageKey) return;
          await remove({ key: imageKey });
        })
      );

      clearLocalState();
    } catch (error) {
      console.error("Error deleting photoAlbum: ", error);
    }
  }

  function clearLocalState() {
    setCurrentPhotoAlbum(null);
    setCurrentImages([]);
  }

  return (
    <main className="app-container">
      <h1 className="greeting">Hello {user?.username}!</h1>
      <h2 className="current-album">
        Current PhotoAlbum: {currentPhotoAlbum?.id}
      </h2>

      <div className="file-input-container">
        <label className="file-input-label">
          Create photoAlbum with one file:
          <input
            type="file"
            accept="image/*"
            onChange={createPhotoAlbumWithFirstImage}
            className="file-input"
          />
        </label>

        <label className="file-input-label">
          Create photoAlbum with multiple files:
          <input
            type="file"
            accept="image/*"
            onChange={createPhotoAlbumWithMultipleImages}
            multiple
            className="file-input"
          />
        </label>

        <label className="file-input-label">
          Add multiple images to current photoAlbum:
          <input
            type="file"
            accept="image/*"
            onChange={addNewImagesToPhotoAlbum}
            disabled={!currentPhotoAlbum}
            multiple
            className="file-input"
          />
        </label>

        <label className="file-input-label">
          Replace last image:
          <input
            type="file"
            accept="image/*"
            onChange={updateLastImage}
            disabled={!currentPhotoAlbum || !currentImages}
            className="file-input"
          />
        </label>
      </div>

      <div className="button-container">
        <button
          onClick={getImagesForPhotoAlbum}
          disabled={!currentPhotoAlbum || !currentImages}
          className="app-button"
        >
          Get Images for Current Photo Album
        </button>
        <button
          onClick={removeImagesFromPhotoAlbum}
          disabled={!currentPhotoAlbum || !currentImages}
          className="app-button"
        >
          Remove images from current PhotoAlbum (does not delete images)
        </button>
        <button
          onClick={deleteImagesForCurrentPhotoAlbum}
          disabled={!currentPhotoAlbum || !currentImages}
          className="app-button"
        >
          Remove images from current PhotoAlbum, then delete images
        </button>
        <button
          onClick={deleteCurrentPhotoAlbumAndImages}
          disabled={!currentPhotoAlbum}
          className="app-button"
        >
          Delete current PhotoAlbum (and images, if they exist)
        </button>
        <button onClick={signOut} className="app-button">
          Sign out
        </button>
      </div>

      <div className="image-container">
        {currentImages &&
          currentImages.map((url, idx) => {
            if (!url) return undefined;
            return (
              <img src={url} key={idx} alt="Storage file" className="image" />
            );
          })}
      </div>
    </main>
  );
}

export default withAuthenticator(App);
