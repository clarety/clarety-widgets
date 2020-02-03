import React from 'react';
import { FileUploadWidget } from '../../src';

export default class FileUploadDemo extends React.Component {
  render() {
    return (
      <div className="m-5">
        <FileUploadWidget
          acceptedFileTypes={['jpg']}
          maxFiles={1}
          maxFileSize="10000.00"
          // showImageEditor={true}
        />
      </div>
    );
  }
}

// Vanilla JS event listeners.
setTimeout(() => {
  const uploader = document.querySelector('.file-uploader');
  uploader.addEventListener('ready', () => console.log('uploader ready!'));
  uploader.addEventListener('busy', () => console.log('uploader busy!'));
}, 5000);
