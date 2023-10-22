import { Request, Response } from 'express';
import Resource, { ResourceDocument } from '../models/resource';
import ApiFeatureClass from "../utils/ApiFeature"
import ApiResponse from '../utils/ApiResponse';


export async function createResource(req: Request, res: Response) {
    try {
        const bodyData: ResourceDocument = req.body as ResourceDocument;
        const resource = await Resource.create<ResourceDocument>(bodyData);
        ApiResponse.fulfill(res, {
            resourceID: resource.get('_id')
        }, 'Success create resource')
    } catch (error: any) {
        ApiResponse.reject(res, error.message, error.status)
    }
}

export async function listResources(req: Request, res: Response) {
    try {
        const api = new ApiFeatureClass<ResourceDocument>(Resource, req.query)

        // All that features can be use combined
        // 1. Search by field name
        //  - With 2 parameters : searchField(default = name), keyword
        //      + searchField is stand for which attribute will be search
        //      + keyword is stand for value for searching
        // Ex: We want to search which documents have substring "Product1" in "name". Query should be look like ?searchField=name&keyword=Product1

        // 2. Filter 
        // - With 1 parameter : filedName[operator]
        //      + filedName[operator] is stand for which attribute will be filter and the filter operator
        // Ex: We want to filter documents have price greater or equal 100. Query should be ?price[gte]=100

        // 3. Pagination
        // - With 2 parameters : size(default = 10), page(default=1)
        //      + size is stand for the number of document in one fetch
        //      + page is stand for the page will be fetched
        // Ex: We want to get 10 item of page 3. Query should be ?page=3&size=10

        // 4. Sort
        // - With 2 parameters : sortDirection(default = asc), sortField(default=_id)
        //      + sortDirection is stand for direction of sort ("asc" for ASCEND, "desc" for DESCEND)
        //      + sortField is stand for field will be sort
        // Ex: We want to sort price descending. Query should be ?desc=&sortField=price
        const resources = await api.search().filter().exec().sort().pagination().query;
        ApiResponse.fulfill(res, resources, 'Success get resources')
    } catch (error: any) {
        console.log(error.stack)
        ApiResponse.reject(res, error.message, error.status)
    }
}

export async function getResource(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const resource = await Resource.findById<ResourceDocument>(id);

        if (!resource) {
            return ApiResponse.reject(res, 'Resource not found', 404)
        }
        return ApiResponse.fulfill(res, resource, 'Success get resource detail')

    } catch (error: any) {
        ApiResponse.reject(res, error.message, error.status)
    }
}

export async function updateResource(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const bodyData = req.body;

        const updatedResource = await Resource.findByIdAndUpdate<ResourceDocument>(
            id,
            bodyData,
            { new: true }
        );
        if (!updatedResource) {
            return ApiResponse.reject(res, 'Resource not found', 404);
        }
        ApiResponse.fulfill(res, [], 'Success update resource')


    } catch (error: any) {
        ApiResponse.reject(res, error.message, error.status)
    }
}

export async function deleteResource(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { hard } = req.query as any;
        // default will be soft delete. For hard delete, add parameter hard with value = 1 
        // Ex: ?hard=1
        const deletedResource = await Resource.findById<ResourceDocument>(id)

        if (!deletedResource) {
            return ApiResponse.reject(res, 'Resource not found', 404)
        }
        if (hard != 1) {
            await deletedResource.updateOne({
                active: false
            })
        } else {
            await deletedResource.deleteOne();

        }
        ApiResponse.fulfill(res, [], 'Success delete resource')


    } catch (error: any) {
        ApiResponse.reject(res, error.message, error.status)

    }
}
