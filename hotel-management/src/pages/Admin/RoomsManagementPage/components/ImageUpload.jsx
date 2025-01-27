import React, { useState } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const UploadWrapper = styled.div`
  .ant-upload-list-picture-card .ant-upload-list-item {
    padding: 0;
  }
`;

const PreviewList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const PreviewItem = styled.div`
  position: relative;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .delete-button {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    padding: 4px;
    cursor: pointer;

    &:hover {
      background: red;
    }
  }
`;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUpload = ({ fileList = [], onChange, maxImages = 5 }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = ({ fileList: newFileList }) => {
    // Chuyển đổi images từ cloudinary sang định dạng của antd upload
    const processedFileList = newFileList.map(file => {
      if (file.url && !file.uid) {
        return {
          ...file,
          uid: file.public_id || file.url,
          name: file.url.substring(file.url.lastIndexOf('/') + 1),
          status: 'done',
          url: file.url
        };
      }
      return file;
    });
    onChange?.(processedFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Chuyển đổi images từ cloudinary sang định dạng của antd upload
  const processedFileList = fileList.map(file => {
    if (file.url && !file.uid) {
      return {
        ...file,
        uid: file.public_id || file.url,
        name: file.url.substring(file.url.lastIndexOf('/') + 1),
        status: 'done',
        url: file.url
      };
    }
    return file;
  });

  return (
    <UploadWrapper>
      <Upload
        listType="picture-card"
        fileList={processedFileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
      >
        {processedFileList.length >= maxImages ? null : uploadButton}
      </Upload>

      <PreviewList>
        {processedFileList.map((file, index) => (
          <PreviewItem key={file.uid || index}>
            <img src={file.url || file.preview} alt={`Preview ${index + 1}`} />
            <button
              className="delete-button"
              onClick={() => {
                const newFileList = processedFileList.filter((_, i) => i !== index);
                onChange(newFileList);
              }}
            >
              <DeleteOutlined />
            </button>
          </PreviewItem>
        ))}
      </PreviewList>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </UploadWrapper>
  );
};

export default ImageUpload; 