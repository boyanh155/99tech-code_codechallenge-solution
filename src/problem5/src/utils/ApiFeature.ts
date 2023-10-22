import { Document, Model } from "mongoose";

class APIFeature<T extends Document> {
    query: Model<T> | any;
    queryStr: any;
    conditions: Array<any>;

    constructor(query: Model<T>, queryStr: any) {
        this.query = query;
        this.queryStr = queryStr;
        this.conditions = []
    }

    search() {
        const fieldName: string = this.queryStr.searchField as string || 'name'
        const keyword = this.queryStr.keyword ? {
            [fieldName]: {
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        } : {}
        this.conditions = [...this.conditions, keyword]

        return this;
    }

    filter() {
        const queryCopy = {
            ...this.queryStr
        };
        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page', 'size','searchField', 'sortField', 'sortDirection']

        removeFields.forEach(el => delete queryCopy[el]);

        // Advance filter for price, ratings etc
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        this.conditions = [...this.conditions, JSON.parse(queryStr)]
        return this;
    }

    sort() {
        const field: string = this.queryStr.sortField as string || '_id'
        const direction: string = this.queryStr.sortDirection as string || 'asc'
        this.query = this.query.sort({
            [field]: direction.toLowerCase() === 'asc' ? 1 : -1
        })
        return this
    }

    pagination() {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = this.queryStr.size * (currentPage - 1);

        this.query = this.query.limit(this.queryStr.size).skip(skip);
        return this;
    }

    exec() {
        if (this.conditions.length > 0) {
            this.query =  this.query.find({ $and: this.conditions });
        }
        console.log(this.conditions)
        this.query = this.query.find({})
        return this;

    }
}

export default APIFeature