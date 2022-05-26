import React, { useState } from 'react';
import gql from 'graphql-tag';
import PetBox from '../components/PetBox';
import NewPet from '../components/NewPet';
import { useQuery, useMutation } from '@apollo/react-hooks';
import Loader from '../components/Loader';

const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
    name
    __typename
    img
    vaccinated @client
    owner {
      id
      age @client
    }
  }
`;

const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

const NEW_PET = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const allPetsResult = useQuery(ALL_PETS);
  const [createPet, createPetResult] = useMutation(NEW_PET, {
    update(cache, { data: { addPet } }) {
      const data = cache.readQuery({ query: ALL_PETS });
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet, ...data.pets] },
      });
    },
  });

  if (allPetsResult.loading) {
    return <Loader />;
  }

  if (allPetsResult.error || createPetResult.error) {
    return <p>Error!</p>;
  }

  const onSubmit = (input) => {
    createPet({
      variables: { newPet: input },
      optimisticResponse: {
        __typename: 'Mutation',
        addPet: {
          __typename: 'Pet',
          id: `$Math.floor(Math.random() * 10000)}`,
          name: input.name,
          type: input.type,
          img: 'https://via.placeholder.com/300',
          owner: {},
        },
      },
    });
    setModal(false);
  };

  const petsList = allPetsResult.data.pets.map((pet) => (
    <div className="col-xs-12 col-md-4 col" key={pet.id}>
      <div className="box">
        <PetBox pet={pet} />
      </div>
    </div>
  ));

  if (modal) {
    return (
      <div className="row center-xs">
        <div className="col-xs-8">
          <NewPet onSubmit={onSubmit} onCancel={() => setModal(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <div className="row">{petsList}</div>
      </section>
    </div>
  );
}
