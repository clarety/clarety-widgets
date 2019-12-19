import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';

const uploadUrl = 'ajax.php?FileUpload/upload';

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export class FileUploadWidget extends React.Component {
  static defaultProps = {
    acceptedFileTypes: [],
    maxFiles: null,
    maxFileSize: null,
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
    const { maxFiles, acceptedFileTypes, maxFileSize } = this.props;

    return (
      <div className="file-uploader">
        <FilePond
          name="filepond"
          allowMultiple={true}
          maxFiles={maxFiles}
          server={uploadUrl}
          acceptedFileTypes={acceptedFileTypes}
          maxFileSize={maxFileSize}
          onprocessfile={this.onProcessFile}
          onremovefile={this.onRemoveFile}
        />
        <input type="hidden" name="contactformfileupload" value={JSON.stringify(uploads)} />
        <input type="hidden" name="filecount-contactformfileupload" value={uploads.length} />
      </div>
    );
  }
}
