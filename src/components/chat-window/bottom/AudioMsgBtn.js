import { InputGroup } from 'rsuite';
import { Icon } from '@rsuite/icons';
import { FaMicrophone } from 'react-icons/fa';
import { ReactMic } from 'react-mic';
import { useState } from 'react';
import { useCallback } from 'react';
import { storage } from '../../../misc/firebase';
import { useParams } from 'react-router';
import { MessageOnError } from '../../../misc/helpers';
const AudioMsgBtn = ({ afterUpload }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { chatId } = useParams();

  const onClick = useCallback(() => {
    setIsRecording((prev) => !prev);
  }, []);

  const onUpload = useCallback(
    async (data) => {
      setIsUploading(true);
      try {
        const snap = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            cacheControl: `public , max-age = ${3600 * 24 * 3}`,
          });

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
        setIsUploading(false);
        afterUpload([file]);
      } catch (error) {
        setIsUploading(false);
        MessageOnError(error.message);
      }
    },
    [afterUpload, chatId]
  );
  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={isUploading}
      className={isRecording ? 'animate-blink' : ''}
    >
      <Icon as={FaMicrophone} size='1.2em' />
      <ReactMic
        record={isRecording}
        className='d-none'
        onStop={onUpload}
        mimeType='audio/mp3'
      />
    </InputGroup.Button>
  );
};

export default AudioMsgBtn;
