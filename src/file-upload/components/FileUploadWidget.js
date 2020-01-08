import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { create as createDoka } from '../react-doka/lib/doka.esm.min';
import '../react-doka/lib/doka.min.css';

// Filepond Plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.min.css';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageFilter from 'filepond-plugin-image-filter';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageFilter,
  FilePondPluginImagePreview,
  FilePondPluginImageEdit,
  FilePondPluginImageTransform,
);

const uploadUrl = 'ajax.php?FileUpload/upload';

export class FileUploadWidget extends React.Component {
  static defaultProps = {
    maxFiles: 1,
    maxFileSize: null,
    acceptedFileTypes: null,
    showImageEditor: false,
  };

  state = { uploads: [] };

  onProcessFile = (error, file) => {
    if (error) return;

    const response = JSON.parse(file.serverId);
    const upload = response[0];

    this.setState(prevState => ({
      uploads: [...prevState.uploads, { appRef: file.id, ...upload }]
    }));
  };

  onRemoveFile = (error, file) => {
    if (error) return;

    this.setState(prevState => ({
      uploads: prevState.uploads.filter(upload => upload.appRef !== file.id)
    }));
  };

  render() {
    const { uploads } = this.state;
    const { maxFiles, acceptedFileTypes, maxFileSize, showImageEditor, name } = this.props;

    return (
      <div className="file-uploader">
        <FilePond
          name="filepond"
          imageEditEditor={showImageEditor ? createDoka() : null}
          maxFiles={maxFiles}
          server={uploadUrl}
          allowFileTypeValidation={!!acceptedFileTypes}
          acceptedFileTypes={acceptedFileTypes}
          maxFileSize={maxFileSize}
          onprocessfile={this.onProcessFile}
          onremovefile={this.onRemoveFile}
          allowMultiple={true}
        />
        <input type="hidden" name={name} value={JSON.stringify(uploads)} />
        <input type="hidden" name={`filecount-${name}`} value={uploads.length} />
      </div>
    );
  }
}
