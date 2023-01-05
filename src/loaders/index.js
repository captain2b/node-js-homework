import postgressLoader from './postgress';

const loaders = () => {
  const pgConnection = postgressLoader();
  console.log('DB Initialized', pgConnection);
};

export default loaders;
