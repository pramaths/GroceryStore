import express from 'express';
import {
  createstorage,
  renamestorage,
  deletestorage,
  getallitems,
} from '../controllers/StorageSpaces';

const router = express.Router();

router.post('/createstorage', createstorage);
router.put('/renamestorage/:oldname', renamestorage);
router.delete('/deletestorage/:id', deletestorage);
router.get('/getallitems/:id', getallitems);

export default router;
