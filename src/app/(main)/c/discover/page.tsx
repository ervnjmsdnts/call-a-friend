import ServiceList from './_components/service-list';

export default async function DiscoverServicesPage() {
  return (
    <div>
      <h2 className='text-lg font-semibold'>Discover Services</h2>
      <ServiceList />
    </div>
  );
}
