import React from 'react';
import { connect } from 'react-redux';
import { FilePond, registerPlugin } from 'react-filepond';
import { getLanguage } from 'shared/translations';
import { updateFormData } from 'form/actions';

// Filepond locales
import pt_BR from 'filepond/locale/pt-br.js';

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

export class _FileUploadInput extends React.Component {
  state = {
    uploads: [],
  };

  onChange = (uploads) => {
    const { field, updateFormData } = this.props;

    // NOTE: we need to json encode this data for HubFormField to process it correctly.
    updateFormData(field, JSON.stringify(uploads));
  };

  onProcessFile = (error, fileItem) => {
    if (!error) {
      const response = JSON.parse(fileItem.serverId);
      const upload = response[0];

      this.setState(prevState => {
        const uploads = [...prevState.uploads, upload];
        this.onChange(uploads);
        return { uploads };
      });
    }
  };

  onUpdateFiles = (fileItems) => {
    // NOTE: we need this callback or previously uploaded files don't remove correctly... :(
  };

  onRemoveFile = (error, fileItem) => {
    if (error) return;

    this.setState(prevState => {
      const uploads = prevState.uploads.filter(upload => upload.token !== fileItem.file.token);
      this.onChange(uploads);
      return { uploads };
    });
  };

  getLocaleProps() {
    switch (getLanguage()) {
      case 'pt': return pt_BR;
    }

    return undefined;
  }

  render() {
    const { maxFiles } = this.props;
    const acceptedFileTypes = this.props.acceptedFileTypes.map(type => mimeTypes[type]);
    const maxFileSize = Number(this.props.maxFileSize || 0).toFixed(0) + 'KB';
    const localeProps = this.getLocaleProps();

    return (
      <div className="file-uploader">
        <FilePond
          name="fileupload"
          server="ajax.php?FileUpload/upload"

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

          {...localeProps}
        />
      </div>
    );
  }
}

const actions = {
  updateFormData: updateFormData,
};

export const FileUploadInput = connect(null, actions)(_FileUploadInput);
