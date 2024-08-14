import {
	json,
	type DataFunctionArgs,
	type HeadersFunction,
} from '@remix-run/node'
import { prisma } from '~/utils/db.server.ts'
import { useLoaderData } from '@remix-run/react'
import {
	combineServerTimings,
	makeTimings,
	time,
} from '~/utils/timing.server.ts'

export async function loader({ params }: DataFunctionArgs) {
	const timings = makeTimings('employment records loader')
	const employee = await time(
		() =>
			prisma.user.findUnique({
				where: {
					username: params.username,
				},
				select: {
					id: true,
					username: true,
					name: true,
					imageId: true,
				},
			}),
		{ timings, type: 'find user' },
	)
	if (!employee) {
		throw new Response('Not found', { status: 404 })
	}
	const employmentRecords = await time(
		() =>
			prisma.employmentRecord.findMany({
				where: {
					employeeId: employee.id,
				},
				select: {
					id: true,
                    employerName: true,
                    title: true,
                    startDate: true,
                    endDate: true,
				},
			}),
		{ timings, type: 'find employment records' },
	)

    return json(
        { employmentRecords },
        { headers: { 'Server-Timing': timings.toString() } },
    )
}

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
	return {
		'Server-Timing': combineServerTimings(parentHeaders, loaderHeaders),
	}
}

type Timestamp = string;
function formatDate(date: Timestamp) {
    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        year: "numeric",
        timeZone: 'UTC',
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

export default function EmploymentRoute() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="flex h-full pb-12">
            <div className="mx-auto">
                <h1>Employment History</h1>
                <hr />
                <ul>
                    {data.employmentRecords.map((record) => (
                        <li key={record.id} className="py-2">
                            <p>{record.title} | {record.employerName}</p>
                            <p>{formatDate(record.startDate)} – {formatDate(record.endDate)}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}