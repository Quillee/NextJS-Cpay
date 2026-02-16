import Breadcrumbs from '@/app/ui/pays/breadcrumbs';
import { fetchContacts, fetchPayById } from '@/app/lib/data';
import EditPayForm from '@/app/ui/pays/edit-form';

export default async function Page({ params }: { params: { id: string } }) {
    const contacts = await fetchContacts();
    const pay = await fetchPayById((await params).id);
    if (!pay) throw new Error('Error retrieving provided ID. Please check the pay exists');

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Pays', href: '/dashboard/pays' },
                    {
                        label: 'Edit Pending Pay',
                        href: '/dashboard/pays/edit',
                        active: true,
                    },
                ]}
            />
            <EditPayForm contacts={contacts} pay={pay} />
        </main>
    );
}

