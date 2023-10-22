import { Router } from "express";
import { createResource, deleteResource, getResource, listResources, updateResource } from "../controllers/resourceController";

const router = Router()

router.route('/').get(listResources).post(createResource)

router.route('/:id').get(getResource).put(updateResource).delete(deleteResource)


export default router