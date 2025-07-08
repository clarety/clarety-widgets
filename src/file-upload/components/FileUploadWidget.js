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

// localisation
import locale_id_ID from 'filepond/locale/id-id.js';

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
  'csv':  'text/csv',
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
    locale: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      uploads: [],
      localeOptions: {},
    };
    
    if (props.previouslyUploaded) {
      // json string contains '&quot;' so convert them to double quotes.
      const json = props.previouslyUploaded.replace(/&quot;/g, '"');
      this.state.uploads = JSON.parse(json);
    }

    if (['id', 'id-ID', 'id_ID'].includes(props.locale)) {
      this.state.localeOptions = locale_id_ID;
    }
  }

  onProcessFile = (error, fileItem) => {    
    this.dispatchEvent();

    if (!error) {
      const response = JSON.parse(fileItem.serverId);
      const upload = response[0];
      upload.filepondId = fileItem.id;

      const maxFiles = Number(this.props.maxFiles) || 1;

      this.setState(prevState => {
        // remove existing upload with this ID.
        const prevUploads = prevState.uploads.filter(upload => upload.filepondId !== fileItem.id);

        // add the new upload, and restrict to max file count.
        const nextUploads = [...prevUploads, upload].slice(-maxFiles);
        
        return {
          uploads: nextUploads,
        };
    });
    }
  };

  onUpdateFiles = (fileItems) => {
    this.dispatchEvent();

    // NOTE: we need this callback or previously uploaded files don't remove correctly... :(
  };

  onRemoveFile = (error, fileItem) => {
    if (error) return;

    this.setState(prevState => ({
      uploads: prevState.uploads.filter(upload => upload.filepondId !== fileItem.id),
    }));
  };

  dispatchEvent() {
    let eventType;
    switch (this.pond._pond.status) {
      case Status.EMPTY:
      case Status.IDLE:
      case Status.READY:
        eventType = 'file-upload--ready';
        break;

      case Status.ERROR:
      case Status.BUSY:
        eventType = 'file-upload--busy';
        break;
    }

    const event = new Event(eventType);
    event.inputName = this.props.name;

    window.dispatchEvent(event);
  }

  render() {
    const { uploads, localeOptions } = this.state;
    const { maxFiles, showImageEditor, name } = this.props;

    const acceptedFileTypes = this.props.acceptedFileTypes.map(type => mimeTypes[type]);
    const maxFileSize = Number(this.props.maxFileSize || 0).toFixed(0) + 'KB';

    return (
      <div className="file-uploader">
        <FilePond
          ref={ref => this.pond = ref}

          name="filepond"
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
          imageEditInstantEdit={!!showImageEditor}

          {...localeOptions}
        />
        <input type="hidden" name={name} value={JSON.stringify(uploads)} />
        <input type="hidden" name={`filecount-${name}`} value={uploads.length} />
      </div>
    );
  }
}
