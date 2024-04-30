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

function SingleFile() {
  // State to hold the recognized text
  const [textData, setTextData] = useState([]);

  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  // Used to display image for current song:
  const [currentImageUrl, setCurrentImageUrl] = useState<
    string | null | undefined
  >("");

  async function createSongWithImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      // Create the API record:
      const response = await client.models.Song.create({
        name: `My first song`,
      });

      const song = response.data;

      if (!song) return;

      // Upload the Storage file:
      const result = await uploadData({
        key: `${song.id}-${file.name}`,
        data: file,
        options: {
          contentType: "image/png", // contentType is optional
        },
      }).result;

      // Add the file association to the record:
      const updateResponse = await client.models.Song.update({
        id: song.id,
        converArtKey: result?.key,
      });

      const updatedSong = updateResponse.data;

      setCurrentSong(updatedSong);

      // If the record has no associated file, we can return early.
      if (!updatedSong.converArtKey) return;

      // Retrieve the file's signed URL:
      const signedURL = await getUrl({ key: updatedSong.converArtKey });
      setCurrentImageUrl(signedURL.url.toString());
    } catch (error) {
      console.error("Error create song / file:", error);
    }
  }

  // Upload image, add to song, retrieve signed URL and retrieve the image.
  // Also updates image if one already exists.
  async function addNewImageToSong(e: React.ChangeEvent<HTMLInputElement>) {
    if (!currentSong) return;

    if (!e.target.files) return;

    const file = e.target.files[0];

    try {
      // Upload the Storage file:
      const result = await uploadData({
        key: `${currentSong.id}-${file.name}`,
        data: file,
        options: {
          contentType: "image/png", // contentType is optional
        },
      }).result;

      // Add the file association to the record:
      const response = await client.models.Song.update({
        id: currentSong.id,
        converArtKey: result?.key,
      });

      const updatedSong = response.data;

      setCurrentSong(updatedSong);

      // If the record has no associated file, we can return early.
      if (!updatedSong?.converArtKey) return;

      // Retrieve the file's signed URL:
      const signedURL = await getUrl({ key: updatedSong.converArtKey });
      setCurrentImageUrl(signedURL.url.toString());
    } catch (error) {
      console.error("Error uploading image / adding image to song: ", error);
    }
  }

  async function getImageForCurrentSong() {
    if (!currentSong) return;
    try {
      // Query the record to get the file key:

      const response = await client.models.Song.get({
        id: currentSong.id,
      });
      const song = response.data;

      // If the record has no associated file, we can return early.
      if (!song?.converArtKey) return;

      // Retrieve the signed URL:
      const signedURL = await getUrl({ key: song.converArtKey });

      setCurrentImageUrl(signedURL.url.toString());
    } catch (error) {
      console.error("Error getting song / image:", error);
    }
  }

  // Remove the file association, continue to persist both file and record
  async function removeImageFromSong() {
    if (!currentSong) return;

    try {
      const response = await client.models.Song.get({
        id: currentSong.id,
      });

      const song = response.data;

      // If the record has no associated file, we can return early.
      if (!song?.converArtKey) return;

      const updatedSong = await client.models.Song.update({
        id: song.id,
        converArtKey: null,
      });

      // If successful, the response here will be `null`:
      setCurrentSong(updatedSong.data);
      setCurrentImageUrl(updatedSong.data?.converArtKey);
    } catch (error) {
      console.error("Error removing image from song: ", error);
    }
  }

  // Remove the record association and delete the file
  async function deleteImageForCurrentSong() {
    if (!currentSong) return;

    try {
      const response = await client.models.Song.get({
        id: currentSong.id,
      });
      const song = response?.data;

      // If the record has no associated file, we can return early.
      if (!song?.converArtKey) return;

      // Remove associated file from record
      const updatedSong = await client.models.Song.update({
        id: song.id,
        converArtKey: null,
      });

      // Delete the file from S3:
      await remove({ key: song.converArtKey });

      // If successful, the response here will be `null`:
      setCurrentSong(updatedSong.data);
      setCurrentImageUrl(updatedSong.data?.converArtKey);
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  }

  // Delete both file and record
  async function deleteCurrentSongAndImage() {
    if (!currentSong) return;

    try {
      const response = await client.models.Song.get({
        id: currentSong.id,
      });

      const song = response.data;

      // If the record has no associated file, we can return early.
      if (!song?.converArtKey) return;

      await remove({ key: song.converArtKey });

      // Delete the record from the API:
      await client.models.Song.delete({ id: song.id });
      clearLocalState();
    } catch (error) {
      console.error("Error deleting song: ", error);
    }
  }

  function clearLocalState() {
    setCurrentSong(null);
    setCurrentImageUrl("");
  }

  return (
    <div>
      <label>
        <h2>{`Current Song: ${currentSong?.id}`}</h2>
        Create song with file:
        <input id="name" type="file" onChange={createSongWithImage} />
      </label>
      <label>
        Add / update song image:
        <input
          id="name"
          type="file"
          onChange={addNewImageToSong}
          disabled={!currentSong}
        />
      </label>
      <button
        onClick={getImageForCurrentSong}
        disabled={!currentSong || !currentImageUrl}
      >
        Get image for current song
      </button>
      <button
        onClick={removeImageFromSong}
        disabled={!currentSong || !currentImageUrl}
      >
        Remove image from current song (does not delete image)
      </button>
      <button
        onClick={deleteImageForCurrentSong}
        disabled={!currentSong || !currentImageUrl}
      >
        Remove image from current song, then delete image
      </button>
      <button onClick={deleteCurrentSongAndImage} disabled={!currentSong}>
        Delete current song (and image, if it exists)
      </button>
    </div>
  );
}

export default SingleFile;
