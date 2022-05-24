import React, { useState } from "react";
import gql from "graphql-tag";
import PetBox from "../components/PetBox";
import NewPet from "../components/NewPet";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loader from "../components/Loader";

const ALL_PETS_QUERY = gql`
  query AllPets {
    pets {
      id
      name
      __typename
      img
    }
  }
`;

const CREATE_PET_MUTATION = gql`
  mutation CreateAPet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      id
      name
      __typename
      img
    }
  }
`;

export default function Pets() {
  const [modal, setModal] = useState(false);
  const allPetsResult = useQuery(ALL_PETS_QUERY);
  const [createPet, createPetResult] = useMutation(CREATE_PET_MUTATION);

  if (allPetsResult.loading || createPetResult.loading) {
    return <Loader />;
  }

  if (allPetsResult.error || createPetResult.error) {
    return <p>Error!</p>;
  }

  const onSubmit = (input) => {
    createPet({
      variables: { newPet: input },
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
