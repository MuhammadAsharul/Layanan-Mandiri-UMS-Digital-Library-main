import { Badge, Box, Button, Text, VisuallyHidden, useDisclosure, useToast } from '@chakra-ui/react';
import { useState, useMemo, useEffect } from 'react'
import { useTable, useSortBy, useFilters, useGlobalFilter, usePagination, useRowSelect } from 'react-table'
import {
    MdOutlineModeEditOutline,
    MdOutlineDeleteOutline,
    MdOutlineLibraryAdd,
    MdOutlineInfo,
    MdOutlineMessage
} from 'react-icons/md'
import { Tooltip } from '@chakra-ui/react';
import API from '../../services';
import { useDispatch, useSelector } from 'react-redux'
import ModalSuggest from '../Modal/ModalSuggest';
import { DetailSuggest, deleteSuggest, setTriggerSuggest, updateSuggest } from '../../features/suggestSlices';

const TableSuggest = () => {

    const [dataSuggest, setDataSuggest] = useState([])
    const [selectedSuggest, setSelectedSuggest] = useState({})
    const [type, setType] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const states = useSelector(state => state.login)
    const stateSuggest = useSelector(state => state.suggest)
    const dispatch = useDispatch()
    const toast = useToast({
        position: 'top-right',
        variant: 'left-accent',
        isClosable: true,
        duration: 2000
    })


    const getDataMySuggest = async () => {
        try {
            const res = await API.getMySuggest()
            console.log("res", res.data)
            setDataSuggest(res.data)
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleModalSuggest = async(data) => {
        setType('EDIT_SUGGEST')
        const res = await dispatch(DetailSuggest(data.suggestionid))

        console.log("res detail suggesttt", res)

        if(res.type === "getDetailSuggest/fulfilled") {
            onOpen()
        }
    }

    const handleDeleteSuggest = (id) => {
        try {
            dispatch(deleteSuggest(id))
            dispatch(setTriggerSuggest(true))
            toast({
                title: 'Delete Suggest a Book',
                description: 'Delete Ulasan Berhasil',
                status: 'success'
            })
            onClose()

        } catch (error) {
            console.log("error", error)
            toast({
                title: 'Delete Suggest a Book',
                description: 'Delete Ulasan Gagal',
                status: 'error'
            })
        }
    }

    // useEffect(() => {
    //     getDataMySuggest()
    // }, [states.trigger])


    useEffect(() => {
        getDataMySuggest()
        setTimeout(() => {
            dispatch(setTriggerSuggest(false))
        }, 1000);
    }, [stateSuggest.triggerSuggest])


    const data = useMemo(
        () => dataSuggest,
        [dataSuggest]
    )

    const columns = useMemo(
        () => [

            {
                Header: 'Tanggal Ulasan',
                accessor: 'suggesteddate',
            },
            {
                Header: 'Judul Buku',
                accessor: 'title',
                Cell: ({ row }) => {
                    return (
                        <>
                            <Box display="flex" flexDirection='column'>
                                <VisuallyHidden>{row.original.suggestionid}</VisuallyHidden>
                                <Text fontWeight="bold">{row.original.title}</Text>
                                <span className="text-sm text-gray-500">
                                    .....................................................
                                </span>
                                <span className="text-sm text-gray-500">
                                    <MdOutlineMessage className="inline-block mr-1 mb-1" /> {row.original.note}
                                </span>
                            </Box>

                        </>
                    )
                },
            },
            {
                Header: 'Author',
                accessor: 'author',
            },
            {
                Header: 'Penerbit',
                accessor: 'publishercode',
            },
            {
                Header: 'Status',
                accessor: 'STATUS',
                Cell: ({ row }) => (
                    <div>
                        {row.original.STATUS === 'PENDING' ? (
                            <span className="text-yellow-500">
                                <Badge colorScheme="yellow">{row.original.STATUS}</Badge>
                            </span>
                        ) : row.original.STATUS === 'ACCEPTED' ? (
                            <span className="text-green-500">
                                <Badge colorScheme="green">{row.original.STATUS}</Badge>
                            </span>
                        ) : row.original.STATUS === 'REJECTED' ? (
                            <span className="text-red-500">
                                <Badge colorScheme="red">{row.original.STATUS}</Badge>
                            </span>
                        ) : (
                            <span className="text-blue-500">
                                <Badge colorScheme="blue">{row.original.STATUS}</Badge>
                            </span>
                        )}
                    </div>
                ),
            },
            {
                accessor: 'suggestionid',
                Cell: ({ row }) => (
                    <VisuallyHidden>
                        <span>{row.original.suggestionid}</span>
                    </VisuallyHidden>
                ),
            },
            {
                Header: 'Options',
                accessor: ''
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
        page,
        pageOptions,
        nextPage,
        previousPage,
        canPreviousPage,
        canNextPage,
        setPageSize,

    } = useTable({
        columns,
        data,
        // defaultColumn, // Be sure to pass the defaultColumn option
    }, useFilters, useGlobalFilter, useSortBy, usePagination, useRowSelect)

    const { globalFilter, pageIndex, pageSize, } = state
    const firstPageRows = rows.slice(0, pageSize)


    return (
        <>
            <div className="bg-white shadow-md rounded ">
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-1">
                        <div>
                            <h2 className="text-lg font-semibold leading-tight pt-2">List Usulan Buku</h2>
                            <Button colorScheme="blue" size="sm" className="float-right py-5 px-2 gap-2"
                                value='SUGGEST'
                                onClick={(e) => {
                                    setType(e.target.value)
                                    onOpen()
                                }}
                            >
                                <MdOutlineLibraryAdd /> Tambah Usulan Buku
                            </Button>
                        </div>

                        <div className="my-4 flex sm:flex-row flex-col">
                            <div className="flex flex-row mb-1 sm:mb-0">
                                <div className="relative">
                                    <select
                                        className="appearance-none h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        value={pageSize}
                                        onChange={(e) => setPageSize(Number(e.target.value))}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="block relative">
                                <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                                        <path
                                            d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                                        </path>
                                    </svg>
                                </span>
                                <input placeholder="Search"
                                    className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    value={globalFilter}
                                />
                            </div>
                        </div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">

                            <Box overflowY="auto" overflowX="hidden" maxHeight='280px' >
                                {(rows.length > 0) ? (
                                    <table {...getTableProps()} className="min-w-full leading-normal">
                                        <thead position="sticky" className="sticky top-0">
                                            {headerGroups.map(headerGroup => (
                                                <tr {...headerGroup.getHeaderGroupProps()}>
                                                    {headerGroup.headers.map(column => (
                                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                            {column.render('Header')}
                                                            <span>
                                                                {column.isSorted
                                                                    ? column.isSortedDesc
                                                                        ? ' 🔽'
                                                                        : ' 🔼'
                                                                    : ''}
                                                            </span>
                                                        </th>
                                                    ))}
                                                </tr>
                                            ))}
                                        </thead>
                                        <tbody {...getTableBodyProps()}>
                                            {page.map(row => {
                                                prepareRow(row)
                                                return (
                                                    <tr {...row.getRowProps()}>
                                                        {row.cells.map(cell => {
                                                            return (
                                                                <td {...cell.getCellProps()} className=" text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                    <div className="">
                                                                        <div className="ml-3">
                                                                            <p className=" text-gray-900 whitespace-no-wrap">
                                                                                {cell.column.Header === 'Tanggal Ulasan' ? (
                                                                                    new Date(cell.value).toLocaleDateString("id-ID", {
                                                                                        weekday: 'long', year:
                                                                                            'numeric', month:
                                                                                            'long', day: 'numeric'
                                                                                    })
                                                                                ) : (
                                                                                    cell.render('Cell')
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {(cell.column.Header === 'Options') ? (
                                                                        <div className='flex items-center gap-2'>
                                                                            <Tooltip label='Edit Suggest Buku' fontSize='md'>
                                                                                <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 font-bold rounded"
                                                                                    type='EDIT_SUGGEST'
                                                                                    onClick={() => {
                                                                                        handleModalSuggest(cell.row.values)
                                                                                    }}
                                                                                >
                                                                                    <MdOutlineModeEditOutline />
                                                                                </button>
                                                                            </Tooltip>
                                                                            <Tooltip label='Delete Suggest Buku' fontSize='md'>
                                                                                <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 font-bold  rounded"
                                                                                    type='DELETE_SUGGEST'
                                                                                    onClick={() => {
                                                                                        console.log("seelectedSuggest", cell.row.values)
                                                                                        handleDeleteSuggest(cell.row.values.suggestionid)
                                                                                    }}
                                                                                >
                                                                                    <MdOutlineDeleteOutline />
                                                                                </button>
                                                                            </Tooltip>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )}
                                                                </td>
                                                            )
                                                        })}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className='flex justify-center items-center h-64'>
                                        <div className='flex flex-col justify-center items-center'>
                                            {/* <img src={Empty} alt='empty' className='w-64 h-64' /> */}
                                            <MdOutlineInfo className='w-10 h-10 text-gray-500' />
                                            <p className='text-2xl font-bold text-gray-500'>Tidak ada pinjaman</p>
                                        </div>
                                    </div>
                                )}

                            </Box>

                                <div
                                    className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                                    <span className="text-xs xs:text-sm text-gray-900">
                                        Showing {pageIndex * pageSize + 1} to {pageIndex * pageSize + pageSize} of {rows.length} entries
                                    </span>
                                    <div className="inline-flex mt-2 xs:mt-0">
                                        <button
                                            className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
                                            onClick={() => previousPage()}
                                            disabled={!canPreviousPage}
                                        >
                                            Prev
                                        </button>
                                        <span className="text-sm  text-gray-800 font-semibold py-2 px-4">
                                            Page{' '}
                                            <strong>
                                                {pageIndex + 1} of {pageOptions.length}
                                            </strong>{' '}
                                        </span>
                                        <button
                                            className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
                                            onClick={() => nextPage()}
                                            disabled={!canNextPage}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Suggest */}
                <ModalSuggest isOpen={isOpen} onClose={onClose} type={type} data={selectedSuggest} />

            </div>
        </>
    )

}


export default TableSuggest;