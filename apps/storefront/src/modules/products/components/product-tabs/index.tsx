'use client'
import { HttpTypes } from "@medusajs/types";
import { Table, Text } from "@medusajs/ui";
import Markdown from "react-markdown";
import Accordion from "./accordion";
import { useEffect, useState } from "react";
import { ArrowDownTray } from "@medusajs/icons"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct;
};

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Description",
      component: <ProductSpecsTab product={product} />,
    },
    {
      label: "Specifications",
      component: <ProductSpecificationsTab product={product} />,
    },
    {
      label: "Documents",
      component: <ProductDocumentsTab product={product} />,
    },
  ];

  return (
    <div className="w-full">
      <Accordion type="multiple" className="flex flex-col gap-y-2">
        {tabs.map((tab, i) => (
          <Accordion.Item
            className="bg-neutral-100 small:px-24 px-6"
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

const ProductSpecsTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8 xl:w-2/3">
      <Markdown
        components={{
          p: ({ children }) => (
            <Text className="text-neutral-950 mb-2">{children}</Text>
          ),
          h2: ({ children }) => (
            <Text className="text-xl text-neutral-950 my-4 font-semibold">
              {children}
            </Text>
          ),
          h3: ({ children }) => (
            <Text className="text-lg text-neutral-950 mb-2">{children}</Text>
          ),
        }}
      >
        {product.description ? product.description : "-"}
      </Markdown>
    </div>
  );
};

const ProductDocumentsTab = ({ product }: ProductTabsProps) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  let downloadFile = async (fileName: string) => {

    let product_id = product.id;
    console.log(fileName);


    try {
      
      let response = await fetch(`http://localhost:9000/store/product-documents/download-file`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
        },
        body: JSON.stringify({ file_name: fileName, product_id: product_id }),
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        console.error('Error downloading file:', response.statusText);
    }



    }catch (error) {
      console.error("Error fetching documents:", error);
    }
    
  };

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`http://localhost:9000/store/product-documents/get?product_id=${product.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '',
          },
        });

        const data = await response.json();
        setDocuments(data); 
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchDocuments();
  }, [product.id]);

  if (loading) {
    return <p>Loading documents...</p>; 
  }

  return (
    <div className="text-small-regular py-8">
      <Table className="rounded-lg shadow-borders-base overflow-hidden border-none">
        <Table.Body>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <Table.Row key={doc.id}>
                <Table.Cell className="border-r">
                  <span className="font-semibold">{doc.file_name}</span>
                </Table.Cell>
                <Table.Cell className="px-2 border-r text-center">{doc.language}</Table.Cell>
                <Table.Cell className="px-4 border-r text-center">{doc.document_type}</Table.Cell>
                <Table.Cell className="px-4 flex justify-center items-center"><ArrowDownTray className=" cursor-default hover:cursor-pointer" onClick={()=>downloadFile(doc.file_name)}/></Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell className="text-center">
                No documents available.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};

const ProductSpecificationsTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-small-regular py-8">
      <Table className="rounded-lg shadow-borders-base overflow-hidden border-none">
        <Table.Body>
          {product.weight && (
            <Table.Row>
              <Table.Cell className="border-r">
                <span className="font-semibold">Weight</span>
              </Table.Cell>
              <Table.Cell className="px-4">{product.weight} grams</Table.Cell>
            </Table.Row>
          )}
          {(product.height || product.width || product.length) && (
            <Table.Row>
              <Table.Cell className="border-r">
                <span className="font-semibold">Dimensions (HxWxL)</span>
              </Table.Cell>
              <Table.Cell className="px-4">
                {product.height}mm x {product.width}mm x {product.length}mm
              </Table.Cell>
            </Table.Row>
          )}

          {product.metadata &&
            Object.entries(product.metadata).map(([key, value]) => (
              <Table.Row key={key}>
                <Table.Cell className="border-r">
                  <span className="font-semibold">{key}</span>
                </Table.Cell>
                <Table.Cell className="px-4">
                  {key === "Catalog card" ? (
                    <span className="font-semibold">
                      <a href={value as string}>download</a>
                    </span>
                  ) : (
                    <p>{value as string}</p>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ProductTabs;
