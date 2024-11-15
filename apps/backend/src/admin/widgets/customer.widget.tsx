import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, Table, Input, Switch } from "@medusajs/ui";
import { useState, useEffect } from "react";

const CustomerWidget = () => {
   type Customer = {
       email: string;
       approved: boolean;
       created_at: string;
       updated_at: string;
       deleted_at: null;
   };

   type PaginationMeta = {
       page: number;
       limit: number;
       total: number;
       pageCount: number;
   };

   const [customers, setCustomers] = useState<Customer[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [currentPage, setCurrentPage] = useState(0);
   const [meta, setMeta] = useState<PaginationMeta | null>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

   const fetchCustomers = async (page: number) => {
    try {
        setIsLoading(true);
        const response = await fetch(
            `http://localhost:9000/admin/customer?page=${page}&limit=20`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            }
        );
        const { customers_approved, meta } = await response.json();
        
        const filteredCustomers = (customers_approved || []).filter(
            customer => !customer.approved
        );
        
        setCustomers(filteredCustomers);

        if (meta) {
            setMeta({
                page: meta.page,
                limit: meta.limit,
                total: meta.total,
                pageCount: meta.pageCount
            });
        }
    } catch (error) {
        console.error("Error fetching customers:", error);
    } finally {
        setIsLoading(false);
    }
};

   const handleSwitchChange = async (email: string, checked: boolean) => {
       const newSelectedCustomers = new Set(selectedCustomers);
       if (checked) {
           newSelectedCustomers.add(email);
       } else {
           newSelectedCustomers.delete(email);
       }
       setSelectedCustomers(newSelectedCustomers);
       console.log("Selected customers:", Array.from(newSelectedCustomers));
   };

   const handleActivateSelected = async () => {
    if (selectedCustomers.size === 0) return;

    try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:9000/admin/customer/${selectedCustomers[0]}/activate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                emails: Array.from(selectedCustomers)
            })
        });

        if (response.ok) {
            
            setSelectedCustomers(new Set());

            if (customers.length === selectedCustomers.size && currentPage > 0) {
                setCurrentPage(0);
            } else {
                
                await fetchCustomers(currentPage);
            }
            
            setTimeout(() => {
                fetchCustomers(currentPage);
            }, 500);

        } else {
            const errorData = await response.json();
            console.error("Error during activation:", errorData);
        }

    } catch (error) {
        console.error("Error activating customers:", error);
    } finally {
        setIsLoading(false);
    }
};

   useEffect(() => {
       fetchCustomers(currentPage);
   }, [currentPage]);

   const filteredCustomers = customers.filter(customer =>
       customer.email.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const canNextPage = meta ? currentPage < meta.pageCount - 1 : false;
   const canPreviousPage = currentPage > 0;

   const nextPage = () => {
       if (canNextPage) {
           setCurrentPage(prev => prev + 1);
       }
   };

   const previousPage = () => {
       if (canPreviousPage) {
           setCurrentPage(prev => prev - 1);
       }
   };

   return (
       <Container className="divide-y p-0">
           <div className="flex items-center justify-between px-6 py-4">
               <Heading level="h1">Inactive customers</Heading>
           </div>
           <div className="py-4 px-2">
               <div className="flex justify-between px-6">
                   <Button 
                       variant="secondary" 
                       onClick={handleActivateSelected}
                       disabled={selectedCustomers.size === 0}
                   >
                       Activate ({selectedCustomers.size})
                   </Button>
                   <Input
                       type="search"
                       className="w-[216px] flex items-center justify-center"
                       placeholder="Search by email"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                   />
               </div>
           </div>
           <div className="px-6 py-4">
               <Table>
                   <Table.Header>
                       <Table.Row>
                           <Table.HeaderCell>Status</Table.HeaderCell>
                           <Table.HeaderCell>Email</Table.HeaderCell>
                           <Table.HeaderCell>Created</Table.HeaderCell>
                           <Table.HeaderCell>Last Update</Table.HeaderCell>
                       </Table.Row>
                   </Table.Header>
                   <Table.Body>
                       {isLoading ? (
                           <Table.Row>
                               <Table.Cell className="text-center">
                                   Loading...
                               </Table.Cell>
                           </Table.Row>
                       ) : (
                           filteredCustomers.map((customer) => (
                               <Table.Row key={customer.email}>
                                   <Table.Cell>
                                       <Switch 
                                           checked={selectedCustomers.has(customer.email)}
                                           onCheckedChange={(checked) => 
                                               handleSwitchChange(customer.email, checked)
                                           }
                                       />
                                   </Table.Cell>
                                   <Table.Cell>{customer.email}</Table.Cell>
                                   <Table.Cell>
                                       {new Date(customer.created_at).toLocaleDateString()}
                                   </Table.Cell>
                                   <Table.Cell>
                                       {new Date(customer.updated_at).toLocaleDateString()}
                                   </Table.Cell>
                               </Table.Row>
                           ))
                       )}
                   </Table.Body>
               </Table>
               {meta && (
                   <Table.Pagination
                       count={meta.total}
                       pageSize={meta.limit}
                       pageIndex={currentPage}
                       pageCount={meta.pageCount}
                       canPreviousPage={canPreviousPage}
                       canNextPage={canNextPage}
                       previousPage={previousPage}
                       nextPage={nextPage}
                   />
               )}
           </div>
       </Container>
   );
};

export const config = defineWidgetConfig({
   zone: "customer.list.after",
});

export default CustomerWidget;