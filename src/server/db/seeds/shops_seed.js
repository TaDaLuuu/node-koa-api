exports.seed = (knex, Promise) => {
  return knex("shops")
    .del()
    .then(() => {
      return knex("shops").insert({
        name: "atolyeTEE",
        image: "abc",
        number_of_sale: 133,
        number_of_favourite: 1233,
        title: "abcd",
        link: "abcde",
      });
    })
    .then(() => {
      return knex("shops").insert({
        name: "The Land Before Time 1",
        image: "abc",
        number_of_sale: 133,
        number_of_favourite: 1233,
        title: "abcd",
        link: "abcde",
      });
    })
    .then(() => {
      return knex("shops").insert({
        name: "The Land Before Time 2",
        image: "abc",
        number_of_sale: 133,
        number_of_favourite: 1233,
        title: "abcd",
        link: "abcde",
      });
    });
};
