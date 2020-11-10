import { composeMongoose } from 'graphql-compose-mongoose';

import mongoose from 'mongoose';
import _ from 'lodash';

import { singlePhotoResolver } from '../helpers/photoResolver';

import { ProductTC } from './ProductTC';

export interface TypeDoc extends mongoose.Document {
  name: string;
  productRefs: string[];
} 

const TypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  photo: String,
}, {
  timestamps: true,
});

const Type = mongoose.model<TypeDoc>('Type', TypeSchema);

TypeSchema.index({ createdAt: 1, updatedAt: 1 });

export const TypeTC = composeMongoose(Type, {});

TypeTC.addRelation(
  'products',
  {
    resolver: () => ProductTC.mongooseResolvers.findMany(),
    args: {
      filter: (source: any) => ({
        typeRef: source._id
      }),
    },
    projection: { productRefs: true },
  } as any
);

export const typeQuery = {
  typeById: TypeTC.mongooseResolvers.findById(),
  typeByIds: TypeTC.mongooseResolvers.findByIds(),
  typeOne: TypeTC.mongooseResolvers.findOne(),
  typeMany: TypeTC.mongooseResolvers.findMany({ filter: { operators: true } }),
  typeCount: TypeTC.mongooseResolvers.count({ filter: { operators: true } }),
  typeConnection: TypeTC.mongooseResolvers.connection(),
  typePagination: TypeTC.mongooseResolvers.pagination(),
};

export const typeMutation = {
  ...singlePhotoResolver({
    typeCreateOne: TypeTC.mongooseResolvers.createOne(),
    typeCreateMany: TypeTC.mongooseResolvers.createMany(),
    typeUpdateById: TypeTC.mongooseResolvers.updateById(),
    typeUpdateOne: TypeTC.mongooseResolvers.updateOne(),
    typeUpdateMany: TypeTC.mongooseResolvers.updateMany({ filter: { operators: true } }),
  }),
  typeRemoveById: TypeTC.mongooseResolvers.removeById(),
  typeRemoveOne: TypeTC.mongooseResolvers.removeOne(),
  typeRemoveMany: TypeTC.mongooseResolvers.removeMany({ filter: { operators: true } }),
};
