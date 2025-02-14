const env = import.meta.env

export default {
  storage: {
    LOCAL: env.VITE_APP_UPLOAD_LOCAL_URL,
    OSS: '',
    QINIU: env.VITE_APP_UPLOAD_QINIU_URL,
    COS: '',
    FTP: '',
    MEMORY: '',
    S3: '',
    MINIO: ''
  },

  storageMode: {
    '1': 'LOCAL',
    '2': 'OSS',
    '3': 'QINIU',
    '4': 'COS',
    '5': 'FTP',
    '6': 'MEMORY',
    '7': 'S3',
    '8': 'MINIO'
  }
}
