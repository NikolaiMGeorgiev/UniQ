import { Room } from "./types";

export const rooms: Room[] = [
    {
        id: '123',
        creatorId: '1',
        name: 'room A',
        description: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blandit quam accumsan ac. Etiam eget quam ullamcorper ex cursus mattis vitae in odio. Sed in diam a purus consectetur rutrum. Maecenas lorem eros, facilisis sed mollis id, dapibus nec ipsum. Vestibulum consequat maximus urna in lacinia. Fusce eget erat tellus. Morbi porttitor tincidunt porttitor. Maecenas a eros sollicitudin, posuere massa in, fringilla ex. Aliquam lobortis elit sit amet nibh laoreet tincidunt. Nulla porttitor ac ex non egestas. Quisque tempor est quis eleifend facilisis. Etiam nec venenatis metus. Integer hendrerit iaculis fermentum. Mauris viverra tempus tincidunt. ',
        startDate: '02-03-2024',
        type: 'non-schedule',
        status: 'active',
        turnDuration: 30,
    },
    {
        id: '124',
        creatorId: '1',
        name: 'room B Asd',
        description: 'room for an exam 2',
        startDate: '02-04-2024',
        type: 'schedule',
        status: 'break',
        turnDuration: 20,
    },
    {
        id: '125',
        creatorId: '1',
        name: 'JS Advanced room',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blanditLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blandit',
        startDate: '02-04-2024',
        type: 'schedule',
        status: 'closed',
        turnDuration: 20,
    },
    {
        id: '126',
        creatorId: '1',
        name: 'JS Advanced room',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blanditLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blandit',
        startDate: '02-04-2024',
        type: 'schedule',
        status: 'closed',
        turnDuration: 20,
    },
    {
        id: '127',
        creatorId: '1',
        name: 'JS Advanced room',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blanditLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue ornare lacinia. Aenean sagittis massa arcu, quis blandit',
        startDate: '02-04-2024',
        type: 'schedule',
        status: 'closed',
        turnDuration: 20,
    }
]