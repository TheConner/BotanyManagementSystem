/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Needed for pivot functions
    pgm.createExtension('tablefunc');

    // Base tables

    pgm.createTable('environments', {
        id: {
            primaryKey: true,
            type: 'serial'
        },
        name: {
            type: 'text',
            notNull: true
        },
        description: {
            type: 'text',
            notNull: true
        },
    });

    pgm.createTable('sensors', {
        id: {
            primaryKey: true,
            type: 'serial'
        },
        environment: {
            type: 'integer',
            references: '"environments"',
            onDelete: 'cascade'
        },
        name: {
            type: 'text',
            notNull: true
        },
        description: {
            type: 'text',
            notNull: true
        },
        data_type: 'text',
        data_type_name: 'text',
        ui_color: 'text'
    });

    pgm.createTable('reading', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        sensor: {
            type: 'integer',
            notNull: true,
            references: '"sensors"',
            onDelete: 'cascade'
        },
        taken_on: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        value: {
            type: 'text',
            notNull: true
        }
    });

    pgm.createTable('environment_tokens', {
        environment: {
            type: 'integer',
            notNull: true,
            references: '"environments"',
            onDelete: 'cascade'
        },
        secret: 'text'
    });

    pgm.createTable('users', {
        id: {
            type: 'serial',
            primaryKey: true
        },
        first_name: {
            type: 'text',
            notNull: true
        },
        last_name: {
            type: 'text',
            notNull: true
        },
        email: {
            type: 'text',
            notNull: true,
            unique: true
        },
        last_login: 'timestamp',
        curr_token: 'text',
        token_expiry: 'timestamp',
        username: {
            type: 'text',
            unique: true
        },
        password: 'text',
        salt: 'text'
    });

    pgm.createTable('images', {
        id: {
            type: 'bigserial',
            primaryKey: true
        },
        mimetype: {
            type: 'text',
            notNull: true
        },
        filename: {
            type: 'text',
            notNull: true
        },
        uploaded_on: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp')
        },
        environment: {
            type: 'integer',
            references: '"environments"'
        },
        filedata: {
            type: 'bytea',
            notNull: true 
        }
    });
};

exports.down = pgm => {};
