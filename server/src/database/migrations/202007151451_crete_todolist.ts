import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('todolist', table => {
        table.increments('id').primary()
        table.string('title').notNullable()
        table.string('name').notNullable()
        table.string('email').notNullable()
        table.integer('status').notNullable()
        table.integer('changescount').notNullable()
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('todolist')

}