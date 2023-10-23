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

        // All those features can be used combined
        // 1. Search by field name
        //  - With 2 parameters : searchField(default = name), keyword
        //      + searchField stands for which attribute will be search
        //      + keyword stands for value for searching
        // Ex: We want to search which documents have substring "Product1" in "name". The query should look like ?searchField=name&keyword=Product1

        // 2. Filter 
        // - With 1 parameter : filedName[operator]
        //      + filedName[operator] stands for which attribute will be filter and the filter operator
        // Ex: We want to filter documents have "price" greater or equal to 100. The query should look like ?price[gte]=100

        // 3. Pagination
        // - With 2 parameters : size(default = 10), page(default=1)
        //      + size stands for the number of document in one fetch
        //      + page stands for the page will be fetched
        // Ex: We want to get 10 item of page 3. The query should look like ?page=3&size=10

        // 4. Sort
        // - With 2 parameters : sortDirection(default = asc), sortField(default=_id)
        //      + sortDirection stands for direction of sort ("asc" for ASCEND, "desc" for DESCEND)
        //      + sortField stands for field will be sort
        // Ex: We want to sort price descending. The query should look like ?sortDirection=desc&sortField=price
        const resources = await api.search().filter().exec().sort().pagination().query;
        ApiResponse.fulfill(res, resources, 'Success get resources')
    } catch (error: any) {
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
