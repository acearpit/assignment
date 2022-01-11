import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Styles from "./events.module.css";
import Avatar from "react-avatar";

const clsx = (...args) => {
  return args.join(", ");
};

const Category = {
  ALL: "ALL_EVENTS",
  WEB: "WEBINAR",
  CODING: "CODING_EVENT",
  BOOTCAMP: "BOOTCAMP_EVENT",
  WORKSHOP: "WORKSHOP",
};

const SubCategory = {
  UPCOMING: "Upcoming",
  ARCHIVED: "Archived",
  FAV: "ALL_TIME_FAVORITES",
};

export const Events = () => {
  const [category, setCategory] = useState(Category.ALL);
  const [sub_category, setSubCategory] = useState(SubCategory.UPCOMING);
  const [selectedTags, setSelectedTags] = useState([]);
  const [pagenum, setPagenum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [tags, setTags] = useState([]);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const fetchTags = async () => {
    const data = await axios.get("https://api.codingninjas.com/api/v3/event_tags");
    setTags(data.data.data.tags);
  };
  useEffect(() => {
    fetchTags();
  }, []);

  const getEvents = async (a, b, c, d) => {
    if (!c) c = [];

    const data = await axios.get(`https://api.codingninjas.com/api/v3/events?event_category=${a}&event_sub_category=${b}&tag_list=${c.join(",")}&offset=${(d - 1) * 20}`);

    setEvents(data.data.data.events);
    setTotalPages(data.data.data.page_count);
  };

  const redirectUrl = (a, b, c, d) => {
    if (c.length) {
      navigate(`/events?event_category=${a}&event_sub_category=${b}&tag_list=${c.join(",")}&page=${d}`);
    } else {
      navigate(`/events?event_category=${a}&event_sub_category=${b}&page=${d}`);
    }
  };

  useEffect(() => {
    const a = params.get("event_category");
    const b = params.get("event_sub_category");
    const c = params.get("tag_list");
    const d = params.get("page");

    setCategory(a);
    setSubCategory(b);

    let t;
    if (!c) t = [];
    else t = c.split(",");
    setSelectedTags(t);

    setPagenum(+d);

    getEvents(a, b, t, d);
  }, [location]);

  return (
    <div className={Styles.container}>
      <div className={Styles.category}>
        {/* All events */}
        <span className={category === Category.ALL && Styles.active} onClick={() => redirectUrl(Category.ALL, SubCategory.UPCOMING, [], 1)}>
          <img src={`https://www.codingninjas.com/assets-landing/images/all-events-${category !== Category.ALL ? "un" : ""}selected.svg`} />
          All Events
        </span>

        {/* Webinars */}
        <span className={category === Category.WEB && Styles.active} onClick={() => redirectUrl(Category.WEB, SubCategory.UPCOMING, [], 1)}>
          <img src={`https://www.codingninjas.com/assets-landing/images/webinar-${category !== Category.WEB ? "un" : ""}selected.svg`} />
          Webinars
        </span>

        {/* Coding events */}
        <span className={category === Category.CODING && Styles.active} onClick={() => redirectUrl(Category.CODING, SubCategory.UPCOMING, [], 1)}>
          <img src={`https://www.codingninjas.com/assets-landing/images/coding-events-${category !== Category.CODING ? "un" : ""}selected.svg`} />
          Coding Events
        </span>

        {/* Bootcamp */}
        <span className={category === Category.BOOTCAMP && Styles.active} onClick={() => redirectUrl(Category.BOOTCAMP, SubCategory.UPCOMING, [], 1)}>
          <img src={`https://files.codingninjas.in/bootcamp_events_${category !== Category.BOOTCAMP ? "unselected-5397" : "selected-5398"}.png`} />
          Bootcamp Events
        </span>

        {/* Workshop */}
        <span className={category === Category.WORKSHOP && Styles.active} onClick={() => redirectUrl(Category.WORKSHOP, SubCategory.UPCOMING, [], 1)}>
          <img src={`https://files.codingninjas.in/workshop_${category !== Category.WORKSHOP ? "unselected-5395" : "selected-5396"}.png`} />
          Workshop
        </span>
      </div>

      <div className={Styles.sub__category}>
        {/* Upcoming */}
        <span
          className={sub_category === SubCategory.UPCOMING && Styles.active}
          onClick={() => {
            setSelectedTags([]);
            setSubCategory(SubCategory.UPCOMING);
            redirectUrl(category, SubCategory.UPCOMING, [], 1);
          }}>
          Upcoming
        </span>

        {/* Archived */}
        <span
          className={sub_category === SubCategory.ARCHIVED && Styles.active}
          onClick={() => {
            setSelectedTags([]);
            setSubCategory(SubCategory.ARCHIVED);
            redirectUrl(category, SubCategory.ARCHIVED, [], 1);
          }}>
          Archived
        </span>

        {/* All time favourites */}
        <span
          className={sub_category === SubCategory.FAV && Styles.active}
          onClick={() => {
            setSelectedTags([]);
            setSubCategory(SubCategory.FAV);
            redirectUrl(category, SubCategory.FAV, [], 1);
          }}>
          All Time Favourites
        </span>
      </div>

      <div className={Styles.events__wrapper}>
        <div className={Styles.events}>
          {events.length ? (
            <>
              {/* Events */}
              {events.map((event) => (
                <div className={Styles.event} key={event.id}>
                  <div className={Styles.upper}>
                    <img src={event.cover_picture} />
                  </div>
                  <div className={Styles.lower}>
                    <h4>{event.name}</h4>
                    <div className={Styles.details}>
                      <div className={Styles.details__top}>
                        <span className={Styles.startson}>Starts on</span>
                        <span className={Styles.fee}>Entry Fee</span>
                        <span className={Styles.venue}>Venue</span>
                      </div>
                      <div className={Styles.details__bottom}>
                        <span className={Styles.starts}>{moment(event.start_time).format("h:mm A, Do MMMM YYYY")}</span>
                        <span className={Styles.fees}>{event.fees === 0 ? "Free" : event.fees}</span>
                        <span className={Styles.ven}>{event.venue}</span>
                      </div>
                    </div>

                    <div className={Styles.desc}>{event.short_desc}</div>

                    <div className={Styles.eventtags}>
                      {event.card_tags.map((tag) => (
                        <span key={tag} className={Styles.eventtag}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className={Styles.footer}>
                      <div className={Styles.users}>
                        <div className={Styles.avatars}>
                          {event.registered_users.top_users.map((user) =>
                            user.image_url ? (
                              <div className={Styles.round}>
                                <img src={user.image_url} />
                              </div>
                            ) : (
                              <Avatar name={user.name} className={Styles.round} size={"30px"} round />
                            )
                          )}
                        </div>
                        <div className={Styles.text}>
                          and <strong>{event.registered_users.other_users_count}</strong> others registered{" "}
                        </div>
                      </div>
                      {sub_category === "Upcoming" && <button>REGISTER NOW</button>}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              <div className={Styles.pagination}>
                {/* Prev page */}
                <button
                  className={Styles.left}
                  disabled={pagenum === 1}
                  onClick={(e) => {
                    setPagenum(pagenum - 1);
                    redirectUrl(category, sub_category, selectedTags, pagenum - 1);
                  }}>
                  <img src="https://files.codingninjas.in/left-arrow-5581.svg" alt="Prev" />
                </button>
                {/* Current page */}
                <span className={Styles.page}>
                  Page{" "}
                  <input
                    type="text"
                    placeholder="_"
                    value={pagenum}
                    onChange={(e) => setPagenum(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        let page = pagenum;
                        if (pagenum <= 0 || pagenum > totalPages) {
                          setPagenum(1);
                          page = 1;
                        }
                        redirectUrl(category, sub_category, selectedTags, page);
                      }
                    }}
                  />{" "}
                  of {totalPages}
                </span>
                {/* Next page */}
                <button
                  className={Styles.right}
                  disabled={pagenum === totalPages}
                  onClick={(e) => {
                    setPagenum(pagenum + 1);
                    redirectUrl(category, sub_category, selectedTags, pagenum + 1);
                  }}>
                  <img src="	https://files.codingninjas.in/right-arrow-5582.svg" alt="Next" />
                </button>
              </div>
            </>
          ) : (
            "No events for the particular selection!"
          )}
        </div>

        {/* Tags section */}
        <div className={Styles.tags}>
          <h4>Tags</h4>
          <div className={Styles.badges}>
            {tags.map((tag) => (
              <span
                className={selectedTags.find((t) => t === tag) ? clsx(Styles.tag, Styles.selected) : Styles.tag}
                key={tag}
                onClick={(e) => {
                  e.preventDefault();

                  let t = [...selectedTags];

                  const idx = t.findIndex((ex_tag) => ex_tag === tag);
                  if (idx >= 0) t.splice(idx, 1);
                  else t = [...t, tag];

                  setSelectedTags(t);
                  redirectUrl(category, sub_category, t, 1);
                }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
