export class Apifeature{
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        //filtering
        const queryValues = { ...this.queryString };
        const expectedQueryValues = ["limit", "page", "sort", "fields" ,"keyword"];
        expectedQueryValues.forEach(val => delete queryValues[val]);
 
        //filtering with [gte , gt , lte , lt]
        let queryStr = JSON.stringify(queryValues);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        if (this.queryString.keyword) {
            this.filterQuery = JSON.parse(queryStr);
        } else {
             this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
        }
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery  = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields)
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            if (modelName === "products") {
                this.filterQuery.$or = [
                    { title: { $regex: this.queryString.keyword, $options: "i" } },
                    { description: { $regex: this.queryString.keyword, $options: "i" } }
                ];
            } else {
                this.filterQuery.name= { $regex: this.queryString.keyword, $options: "i" } 
            }
            this.mongooseQuery = this.mongooseQuery.find(this.filterQuery);
        }
        return this;
    }

    paginate(documentCount) {
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 5;
        const skip = (page - 1) * limit;
        const endPageIndex = page * limit;

        const pagination = {};
        pagination.currentage = page;
        pagination.limit = limit;
        pagination.numberOfPages =Math.ceil( documentCount / limit);

        if (endPageIndex < documentCount) {
            pagination.next = +page + 1;
        }

        if (skip > 0) {
            pagination.previous = page - 1;
        }
        
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;
        return this;
    }
}