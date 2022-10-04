import { objectType, extendType, arg, inputObjectType, nonNull } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import shortid from 'shortid'
import { companies } from "./Company";

export const Person = objectType({
  name: "Person",
  definition: t => {
    t.nonNull.string("id")
    t.nonNull.string("name")
    t.string('companyId')
    t.string('city')
    t.field('company', {
      type: 'Company',
      resolve: (source, args, ctx, info) => {
        return companies.find(x => x.id === source.companyId) as any
      }
    })
  },
});

export const PersonInput = inputObjectType({
  name: 'PersonInput',
  definition: t => {
    t.string("id")
    t.string("name")
    t.string("city")
    t.string("companyId")
  }
})

let persons: NexusGenObjects["Person"][] = [
  {
    name: 'conny',
    id: "1",
    companyId: "1",
    city: "los santos"
  },
  {
    name: 'ronny',
    id: "2",
    companyId: "1",
    city: "vice city"
  },
  {
    name: 'sonny',
    id: "3",
    companyId: "2",
    city: "liberty city"
  }
]

export const PersonsQuery = extendType({
  type: 'Query',
  definition: root => {
    root.nonNull.list.nonNull.field('persons', {
      type: "Person",
      resolve: (parent, args, ctx, info) => {
        return persons
      }
    })
  }
})

export const UpsertPersonMutation = extendType({
  type: 'Mutation',
  definition: root => {
    root.field('upsertPerson', {
      type: 'Person',
      args: {
        record: nonNull(PersonInput)
      },
      resolve: (parent, args, ctx, info) => {
        let { record } = args
        if (!record.id) record.id = shortid()
        let person = persons.find(x => x.id === record.id) || {} as any
        Object.assign(person, record)
        persons = persons.filter(x => x.id !== record.id)
        persons.push(person)
        return person
      }
    })
  }
})