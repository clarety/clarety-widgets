import React from 'react';
import { FileUploadWidget } from '../../src';
import './styles/file-upload.css';

export default class FileUploadDemo extends React.Component {
  render() {
    return (
      <div className="m-5">
        <FileUploadWidget
          name="test-file-upload"
          acceptedFileTypes={['jpg', 'png']}
          maxFiles={10}
          maxFileSize="10000.00"
          // showImageEditor={true}
        />
      </div>
    );
  }
}

// Vanilla JS event listeners.
setTimeout(() => {
  window.addEventListener('file-upload--ready', event => console.log('uploader ready!', event.inputName));
  window.addEventListener('file-upload--busy', event => console.log('uploader busy!', event.inputName));
}, 5000);
