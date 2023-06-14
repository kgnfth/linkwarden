import useCollectionStore from "@/store/collections";
import {
  faBox,
  faEllipsis,
  faPlus,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CollectionCard from "@/components/CollectionCard";
import Dropdown from "@/components/Dropdown";
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import { useSession } from "next-auth/react";
import useModalStore from "@/store/modals";
import SortDropdown from "@/components/SortDropdown";
import { Sort } from "@/types/global";
import useSort from "@/hooks/useSort";

export default function Collections() {
  const { collections } = useCollectionStore();
  const [expandDropdown, setExpandDropdown] = useState(false);
  const [sortDropdown, setSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<Sort>(Sort.NameAZ);
  const [sortedCollections, setSortedCollections] = useState(collections);

  const session = useSession();

  const { setModal } = useModalStore();

  useSort({ sortBy, setData: setSortedCollections, data: collections });

  return (
    <MainLayout>
      <div className="p-5">
        <div className="flex gap-3 items-center justify-between mb-5">
          <div className="flex gap-3 items-end">
            <div className="flex gap-2">
              <FontAwesomeIcon
                icon={faBox}
                className="sm:w-8 sm:h-8 w-6 h-6 mt-2 text-sky-500 drop-shadow"
              />
              <p className="sm:text-4xl text-3xl capitalize bg-gradient-to-tr from-sky-500 to-slate-400 bg-clip-text text-transparent font-bold">
                All Collections
              </p>
            </div>
            <div className="relative">
              <div
                onClick={() => setExpandDropdown(!expandDropdown)}
                id="expand-dropdown"
                className="inline-flex rounded-md cursor-pointer hover:bg-slate-200 duration-100 p-1"
              >
                <FontAwesomeIcon
                  icon={faEllipsis}
                  id="expand-dropdown"
                  className="w-5 h-5 text-gray-500"
                />
              </div>

              {expandDropdown ? (
                <Dropdown
                  items={[
                    {
                      name: "New Collection",
                      onClick: () => {
                        setModal({
                          modal: "COLLECTION",
                          state: true,
                          method: "CREATE",
                          active: {
                            name: "",
                            description: "",
                            color: "#0ea5e9",
                            isPublic: false,
                            ownerId: session.data?.user.id as number,
                            members: [],
                          },
                        });
                        setExpandDropdown(false);
                      },
                    },
                  ]}
                  onClickOutside={(e: Event) => {
                    const target = e.target as HTMLInputElement;
                    if (target.id !== "expand-dropdown")
                      setExpandDropdown(false);
                  }}
                  className="absolute top-8 left-0 w-36"
                />
              ) : null}
            </div>
          </div>

          <div className="relative">
            <div
              onClick={() => setSortDropdown(!sortDropdown)}
              id="sort-dropdown"
              className="inline-flex rounded-md cursor-pointer hover:bg-slate-200 duration-100 p-1"
            >
              <FontAwesomeIcon
                icon={faSort}
                id="sort-dropdown"
                className="w-5 h-5 text-gray-500"
              />
            </div>

            {sortDropdown ? (
              <SortDropdown
                sortBy={sortBy}
                setSort={setSortBy}
                toggleSortDropdown={() => setSortDropdown(!sortDropdown)}
              />
            ) : null}
          </div>
        </div>

        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5">
          {sortedCollections.map((e, i) => {
            return <CollectionCard key={i} collection={e} />;
          })}

          <div
            className="p-5 self-stretch bg-gradient-to-tr from-sky-100 from-10% via-gray-100 via-20% min-h-[12rem] rounded-2xl cursor-pointer shadow duration-100 hover:shadow-none flex flex-col gap-4 justify-center items-center group"
            onClick={() => {
              setModal({
                modal: "COLLECTION",
                state: true,
                method: "CREATE",
                active: {
                  name: "",
                  description: "",
                  color: "#0ea5e9",
                  isPublic: false,
                  ownerId: session.data?.user.id as number,
                  members: [],
                },
              });
            }}
          >
            <p className="text-sky-900 group-hover:opacity-0 duration-100">
              New Collection
            </p>
            <FontAwesomeIcon
              icon={faPlus}
              className="w-8 h-8 text-sky-500 group-hover:w-12 group-hover:h-12 group-hover:-mt-10 duration-100"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
