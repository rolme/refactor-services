export default `
  mutation UpdateUser(
    $name : String,
    $picture: S3ObjectInput,
    $profile: ProfileInput
  ) {
    updateUser( name: $name, picture: $picture, profile: $profile ) {
      id
    }
}`;
