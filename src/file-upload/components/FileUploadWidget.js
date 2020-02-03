import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { Status } from 'filepond';
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

const mimeTypes = {
  'txt':  'text/plain',
  'jpeg': 'image/jpeg',
  'jpg':  'image/jpeg',
  'png':  'image/png',
  'gif':  'image/gif',
  'pdf':  'application/pdf',
  'rtf':  'application/rtf',
  'doc':  'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const typeLabels = {};
Object.entries(mimeTypes).forEach(([key, value]) => typeLabels[value] = key);

export class FileUploadWidget extends React.Component {
  static defaultProps = {
    maxFiles: 1,
    maxFileSize: null,
    acceptedFileTypes: [],
    showImageEditor: false,
  };

  constructor(props) {
    super(props);

    this.state = { uploads: [], initialFiles: [] };
    
    if (props.previouslyUploaded) {
      // json string contains '&quot;' so convert them to double quotes.
      const json = props.previouslyUploaded.replace(/&quot;/g, '"');
      const previouslyUploaded = JSON.parse(json);

      this.state.uploads = previouslyUploaded;

      this.state.initialFiles = previouslyUploaded.map(file => ({
        source: file.token,
        options: { type: 'local', file: file },
      }));
    }
  }

  onProcessFile = (error, fileItem) => {    
    this.dispatchEvent();

    if (!error) {
      const response = JSON.parse(fileItem.serverId);
      const upload = response[0];

      this.setState(prevState => ({
        uploads: [...prevState.uploads, upload]
      }));
    }
  };

  onUpdateFiles = (fileItems) => {
    this.dispatchEvent();

    // NOTE: we need this callback or previously uploaded files don't remove correctly... :(
  };

  onRemoveFile = (error, fileItem) => {
    if (error) return;

    this.setState(prevState => ({
      uploads: prevState.uploads.filter(upload => upload.token !== fileItem.file.token),
    }));
  };

  dispatchEvent() {
    if (!this.ref) return;

    let event;
    switch (this.pond._pond.status) {
      case Status.EMPTY:
      case Status.IDLE:
      case Status.READY:
        event = new Event('ready');
        break;

      case Status.ERROR:
      case Status.BUSY:
        event = new Event('busy');
        break;
    }

    this.ref.dispatchEvent(event);
  }

  render() {
    const { uploads } = this.state;
    const { maxFiles, showImageEditor, name } = this.props;

    const acceptedFileTypes = this.props.acceptedFileTypes.map(type => mimeTypes[type]);
    const maxFileSize = Number(this.props.maxFileSize || 0).toFixed(0) + 'KB';

    return (
      <div className="file-uploader" ref={ref => this.ref = ref}>
        <FilePond
          ref={ref => this.pond = ref}

          name="filepond"
          files={this.state.initialFiles}
          server={uploadUrl}

          allowMultiple={maxFiles > 1}
          maxFiles={maxFiles}
          maxFileSize={maxFileSize}

          allowFileTypeValidation={true}
          acceptedFileTypes={acceptedFileTypes}
          fileValidateTypeLabelExpectedTypesMap={typeLabels}

          onprocessfile={this.onProcessFile}
          onupdatefiles={this.onUpdateFiles}
          onprocessfiles={this.onProcessFiles}
          onremovefile={this.onRemoveFile}
          
          imageEditEditor={showImageEditor ? createDoka() : null}
        />
        <input type="hidden" name={name} value={JSON.stringify(uploads)} />
        <input type="hidden" name={`filecount-${name}`} value={uploads.length} />
      </div>
    );
  }
}
