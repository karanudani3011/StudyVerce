import express from 'express';
import {
  getCommunities,
  createCommunity,
  joinCommunity,
  deleteCommunity,
} from '../controllers/communityController.js';

const router = express.Router();

router.get('/', getCommunities);
router.post('/', createCommunity);
router.post('/:id/join', joinCommunity);
router.delete('/:id', deleteCommunity);

export default router;
