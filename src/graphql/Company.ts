import { objectType, extendType, inputObjectType, nonNull, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import shortid from 'shortid'

export const Company = objectType({
  name: "Company",
  definition: t => {
    t.nonNull.string("id")
    t.nonNull.string("name")
    t.string("wifiPassword")
  },
});


export let companies: NexusGenObjects["Company"][] = [
  {
    name: 'Helsingborg',
    id: "1",
    wifiPassword: ""
  },
  {
    name: 'Malmö',
    id: "2",
    wifiPassword: "datas4f3"
  }
]

export const CompanyQuery = extendType({
  type: 'Query',
  definition: root => {
    root.field('company', {
      type: "Company",
      args: {
        id: nonNull(stringArg())
      },
      resolve: (parent, args, ctx, info) => {
        const {id} = args
        return companies.find(x => x.id === id) as any
      }
    })
  }
})
