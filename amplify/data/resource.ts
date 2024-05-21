import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Song: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      converArtPath: a.string(),
    })
    .authorization((allow) => [allow.authenticated()]),
  PhotoAlbum: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
      imagePaths: a.string().array(),
    })
    .authorization((allow) => [allow.authenticated()]),
  Test0: a
    .model({
      name: a.string(),
      test1Id: a.id(),
      test1: a.belongsTo("Test1", "test1Id"),
      test2id: a.id(),
      test2: a.belongsTo("Test2", "test2id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test1: a
    .model({
      name: a.string(),
      test0s: a.hasMany("Test0", "test1Id"),
      test2id: a.id(),
      test2: a.belongsTo("Test2", "test2id"),
      test7s: a.hasMany("Test7", "test1id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test2: a
    .model({
      name: a.string(),
      test1s: a.hasMany("Test1", "test2id"),
      test3id: a.id(),
      test3: a.belongsTo("Test3", "test3id"),
      test7s: a.hasMany("Test7", "test2id"),
      test0s: a.hasMany("Test0", "test2id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test3: a
    .model({
      name: a.string(),
      test2s: a.hasMany("Test2", "test3id"),
      test4id: a.id(),
      test4: a.belongsTo("Test4", "test4id"),
      test5id: a.id(),
      test5: a.belongsTo("Test5", "test5id"),
      test7s: a.hasMany("Test7", "test3id"),
      test11s: a.hasMany("Test11", "test3id"),
      test12: a.hasMany("Test12", "test3id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test4: a
    .model({
      name: a.string(),
      test3s: a.hasMany("Test3", "test4id"),
      test6id: a.id(),
      test6: a.belongsTo("Test6", "test6id"),
      test7s: a.hasMany("Test7", "test4id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test5: a
    .model({
      name: a.string(),
      test3s: a.hasMany("Test3", "test5id"),
      test7s: a.hasMany("Test7", "test5id"),
      test9s: a.hasMany("Test9", "test5id"),
      test10s: a.hasMany("Test10", "test5id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test6: a
    .model({
      name: a.string(),
      test4s: a.hasMany("Test4", "test6id"),
      test7id: a.id(),
      test7: a.belongsTo("Test7", "test7id"),
      test8id: a.id(),
      test8: a.belongsTo("Test8", "test8id"),
      test10: a.hasMany("Test10", "test6id"),
      test11: a.hasMany("Test11", "test6id"),
      test12: a.hasMany("Test12", "test6id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test7: a
    .model({
      name: a.string(),
      test6s: a.hasMany("Test6", "test7id"),
      test1id: a.id(),
      test1: a.belongsTo("Test1", "test1id"),
      test2id: a.id(),
      test2: a.belongsTo("Test2", "test2id"),
      test3id: a.id(),
      test3: a.belongsTo("Test3", "test3id"),
      test4id: a.id(),
      test4: a.belongsTo("Test4", "test4id"),
      test5id: a.id(),
      test5: a.belongsTo("Test5", "test5id"),
      test12s: a.hasMany("Test12", "test7id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  Test8: a
    .model({
      name: a.string(),
      test6s: a.hasMany("Test6", "test8id"),
      test9id: a.id(),
      test9: a.belongsTo("Test9", "test9id"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Test9: a
    .model({
      name: a.string(),
      test8s: a.hasMany("Test8", "test9id"),
      test5id: a.id(),
      test5: a.belongsTo("Test5", "test5id"),
      test10: a.hasMany("Test10", "test9id"),
      test11: a.hasMany("Test11", "test9id"),
      test12: a.hasMany("Test12", "test9id"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Test10: a
    .model({
      name: a.string(),
      test5id: a.id(),
      test5: a.belongsTo("Test5", "test5id"),
      test6id: a.id(),
      test6: a.belongsTo("Test6", "test6id"),
      test9id: a.id(),
      test9: a.belongsTo("Test9", "test9id"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Test11: a
    .model({
      name: a.string(),
      test6id: a.id(),
      test6: a.belongsTo("Test6", "test6id"),
      test3id: a.id(),
      test3: a.belongsTo("Test3", "test3id"),
      test9id: a.id(),
      test9: a.belongsTo("Test9", "test9id"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Test12: a
    .model({
      name: a.string(),
      test6id: a.id(),
      test6: a.belongsTo("Test6", "test6id"),
      test3id: a.id(),
      test3: a.belongsTo("Test3", "test3id"),
      test9id: a.id(),
      test9: a.belongsTo("Test9", "test9id"),
      test7id: a.id(),
      test7: a.belongsTo("Test7", "test7id"),
    })
    .authorization((allow) => [allow.authenticated()]),

  // add to 5 post and comments table with one to many relation between them
  Post: a
    .model({
      id: a.id(),
      title: a.string(),
      content: a.string(),
      comment: a.hasMany("Comment", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Comment: a
    .model({
      id: a.id(),
      content: a.string(),
      postId: a.id(),
      post: a.belongsTo("Post", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post1", "postId"),
      tag: a.belongsTo("Tag", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post1: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag2: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post2", "postId"),
      tag: a.belongsTo("Tag2", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post2: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag2", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag2: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag2", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag3: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post3", "postId"),
      tag: a.belongsTo("Tag3", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post3: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag3", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag3: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag3", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag4: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post4", "postId"),
      tag: a.belongsTo("Tag4", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post4: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag4", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag4: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag4", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag5: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post5", "postId"),
      tag: a.belongsTo("Tag5", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post5: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag5", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag5: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag5", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag6: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post6", "postId"),
      tag: a.belongsTo("Tag6", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post6: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag6", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag6: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag6", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag7: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post7", "postId"),
      tag: a.belongsTo("Tag7", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post7: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag7", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag7: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag7", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag8: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post8", "postId"),
      tag: a.belongsTo("Tag8", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post8: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag8", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag8: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag8", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag9: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post9", "postId"),
      tag: a.belongsTo("Tag9", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post9: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag9", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag9: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag9", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag10: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post10", "postId"),
      tag: a.belongsTo("Tag10", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post10: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag10", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag10: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag10", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag11: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post11", "postId"),
      tag: a.belongsTo("Tag11", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post11: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag11", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag11: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag11", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag12: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post12", "postId"),
      tag: a.belongsTo("Tag12", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post12: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag12", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag12: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag12", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Todo: a
    .model({
      content: a.string(),
      owner: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [index("owner")]),
  Article: a
    .model({
      content: a.string(),
      owner: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .secondaryIndexes((index) => [index("owner")]),
  PostTag13: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post13", "postId"),
      tag: a.belongsTo("Tag13", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post13: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag13", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag13: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag13", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag14: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post14", "postId"),
      tag: a.belongsTo("Tag14", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post14: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag14", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag14: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag14", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag15: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post15", "postId"),
      tag: a.belongsTo("Tag15", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post15: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag15", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag15: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag15", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag16: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post16", "postId"),
      tag: a.belongsTo("Tag16", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post16: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag16", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag16: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag16", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag17: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post17", "postId"),
      tag: a.belongsTo("Tag17", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post17: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag17", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag17: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag17", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag18: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post18", "postId"),
      tag: a.belongsTo("Tag18", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post18: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag18", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag18: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag18", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag19: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post19", "postId"),
      tag: a.belongsTo("Tag19", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post19: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag19", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag19: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag19", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag20: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post20", "postId"),
      tag: a.belongsTo("Tag20", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post20: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag20", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag20: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag20", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag21: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post21", "postId"),
      tag: a.belongsTo("Tag21", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post21: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag21", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag21: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag21", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag22: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post22", "postId"),
      tag: a.belongsTo("Tag22", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post22: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag22", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag22: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag22", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag23: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post23", "postId"),
      tag: a.belongsTo("Tag23", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post23: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag23", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag23: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag23", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag24: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post24", "postId"),
      tag: a.belongsTo("Tag24", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post24: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag24", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag24: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag24", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag25: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post25", "postId"),
      tag: a.belongsTo("Tag25", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post25: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag25", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag25: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag25", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag26: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post26", "postId"),
      tag: a.belongsTo("Tag26", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post26: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag26", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag26: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag26", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag27: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post27", "postId"),
      tag: a.belongsTo("Tag27", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post27: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag27", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag27: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag27", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag28: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post28", "postId"),
      tag: a.belongsTo("Tag28", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post28: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag28", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag28: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag28", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag29: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post29", "postId"),
      tag: a.belongsTo("Tag29", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post29: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag29", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag29: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag29", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  PostTag30: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),

      post: a.belongsTo("Post30", "postId"),
      tag: a.belongsTo("Tag30", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Post30: a
    .model({
      title: a.string(),
      content: a.string(),
      tags: a.hasMany("PostTag30", "postId"),
    })
    .authorization((allow) => [allow.authenticated()]),
  Tag30: a
    .model({
      name: a.string(),
      posts: a.hasMany("PostTag30", "tagId"),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
