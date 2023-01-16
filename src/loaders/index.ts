import postgressLoader from './postgress';

const loaders = () => {
    const pgConnection = postgressLoader();
    console.log('DB Initialized', pgConnection);
    // console.log('SQ connection Initialized', sqConnection);
};

export default loaders;
