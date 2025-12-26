import DataUriParser from 'datauri/parser';
import Path from 'path';

const parser = new DataUriParser();

const getDataUri = (file: Express.Multer.File) => {
  const extName = Path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer).content;
};

export default getDataUri;
